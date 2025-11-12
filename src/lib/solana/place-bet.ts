import { Program, BN, AnchorProvider } from "@coral-xyz/anchor"
import {
    PublicKey,
    SystemProgram,
    Transaction,
    Connection,
} from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import type { SwivPrivacy } from "@/lib/types/idl"
import IDL from "@/lib/idl/idl.json"
import { encryptPrediction } from "./arcium-encryption"
import {
    deserializeLE,
    getArciumProgAddress,
    getClusterAccAddress,
    getCompDefAccAddress,
    getCompDefAccOffset,
    getComputationAccAddress,
    getExecutingPoolAccAddress,
    getMempoolAccAddress,
    getMXEAccAddress
} from "@arcium-hq/client"
import { randomBytes } from "crypto"

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);

export interface PlaceBetParams {
    poolId: number
    predictedPrice: number
    stakeAmount: number
}

export interface ClaimRewardsParams {
    poolId: number
}

export async function placeEncryptedBet(
    connection: Connection,
    embeddedWallet: any,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
    params: PlaceBetParams,
): Promise<{ signature: string; }> {
    try {
        console.log("[placeEncryptedBet] Starting encrypted bet placement...", embeddedWallet)
        const walletPublicKey = new PublicKey(embeddedWallet.address)

        // Get user's token account (USDC)
        const usdcMint = new PublicKey(process.env.NEXT_PUBLIC_USDC_TOKEN_MINT!)
        const userTokenAccount = await getAssociatedTokenAddress(usdcMint, walletPublicKey)

        console.log("[placeEncryptedBet] Encrypting prediction...")

        const wallet = {
            publicKey: walletPublicKey,
            signTransaction: embeddedWallet.signTransaction.bind(embeddedWallet),
            signAllTransactions: async (txs: Transaction[]) => {
                return Promise.all(txs.map(tx => embeddedWallet.signTransaction(tx)))
            },
        }

        const provider = new AnchorProvider(
            connection,
            wallet as any,
            AnchorProvider.defaultOptions(),
        )

        const encryptedData = await encryptPrediction(params.predictedPrice, provider, PROGRAM_ID)

        // Derive PDAs
        const [poolPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("pool"), new BN(params.poolId).toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID,
        )

        const [poolVaultPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("pool_vault"), new BN(params.poolId).toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID,
        )

        const [betPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("bet"), poolPda.toBuffer(), walletPublicKey.toBuffer()],
            PROGRAM_ID,
        )

        const program = new Program<SwivPrivacy>(IDL as SwivPrivacy, provider)

        // Get Arcium accounts
        const mxeAccount = getMXEAccAddress(PROGRAM_ID)
        const mempoolAccount = getMempoolAccAddress(PROGRAM_ID)
        const executingPool = getExecutingPoolAccAddress(PROGRAM_ID)
        const processBetComputationOffset = new BN(randomBytes(8), "hex")
        const computationAccount = getComputationAccAddress(
            PROGRAM_ID,
            processBetComputationOffset
        )
        const compDefAccount = getCompDefAccAddress(
            PROGRAM_ID,
            Buffer.from(getCompDefAccOffset("process_bet")).readUInt32LE()
        )
        const clusterAccount = getClusterAccAddress(768109697)
        const bnNonce = new BN(deserializeLE(encryptedData.nonce).toString())

        console.log("[placeEncryptedBet] Encrypted data prepared:", {
            ciphertext: Array.from(encryptedData.ciphertext).slice(0, 8),
            publicKey: Array.from(encryptedData.publicKey).slice(0, 8),
            nonce: bnNonce.toString(),
        })

        console.log("[placeEncryptedBet] Building transaction...")

        // Create transaction
        const tx = await program.methods
            .placeEncryptedBet(
                processBetComputationOffset,
                Array.from(encryptedData.ciphertext),
                Array.from(encryptedData.publicKey),
                bnNonce,
            )
            .accounts({
                pool: poolPda,
                poolVault: poolVaultPda,
                bet: betPda,
                userTokenAccount,
                user: walletPublicKey,
                payer: walletPublicKey,
                mxeAccount,
                mempoolAccount,
                executingPool,
                computationAccount,
                compDefAccount,
                clusterAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                arciumProgram: getArciumProgAddress(),
            })
            .transaction()

        const { blockhash } = await connection.getLatestBlockhash()
        tx.recentBlockhash = blockhash
        tx.feePayer = walletPublicKey

        console.log("[placeEncryptedBet] Signing transaction...")
        const signedTx = await signTransaction(tx)

        console.log("[placeEncryptedBet] Sending transaction...")
        const signature = await connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
        })

        console.log("[placeEncryptedBet] Confirming transaction...")
        await connection.confirmTransaction(signature, "confirmed")
        console.log("[placeEncryptedBet] Bet placed successfully:", signature)

        return {
            signature,
        }
    } catch (error: any) {
        console.error("[placeEncryptedBet] Place bet error:", error)

        if ("logs" in error) {
            console.error("[placeEncryptedBet] Transaction logs:", error.logs)
        } else if (error.getLogs) {
            try {
                const logs = await error.getLogs()
                console.error("[placeEncryptedBet] Detailed logs:", logs)
            } catch (e) {
                console.error("[placeEncryptedBet] Could not fetch logs")
            }
        }

        throw error
    }
}

export async function claimRewards(
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
    params: ClaimRewardsParams,
): Promise<string> {
    try {
        console.log("[v0] Starting claim rewards...")
        console.log("[v0] Pool ID:", params.poolId)

        // Derive PDAs
        const [poolPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("pool"), new BN(params.poolId).toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID,
        )

        const [betPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("bet"), poolPda.toBuffer(), walletPublicKey.toBuffer()],
            PROGRAM_ID,
        )

        // Create program instance
        const program = new Program<SwivPrivacy>(
            IDL as SwivPrivacy,
            {
                connection,
                publicKey: walletPublicKey,
            } as any,
        )

        // Get Arcium accounts
        const mxeAccount = getMXEAccAddress(PROGRAM_ID)
        const mempoolAccount = getMempoolAccAddress(PROGRAM_ID)
        const executingPool = getExecutingPoolAccAddress(PROGRAM_ID)
        const claimRewardComputationOffset = new BN(randomBytes(8), "hex")
        const computationAccount = getComputationAccAddress(
            PROGRAM_ID,
            claimRewardComputationOffset
        )
        const compDefAccount = getCompDefAccAddress(
            PROGRAM_ID,
            Buffer.from(getCompDefAccOffset("calculate_reward")).readUInt32LE()
        )
        const clusterAccount = getClusterAccAddress(768109697)

        console.log("[v0] Building claim transaction...")
        const tx = await program.methods
            .calculateReward(claimRewardComputationOffset)
            .accounts({
                pool: poolPda,
                bet: betPda,
                user: walletPublicKey,
                mxeAccount: mxeAccount,
                mempoolAccount: mempoolAccount,
                executingPool: executingPool,
                computationAccount: computationAccount,
                compDefAccount: compDefAccount,
                clusterAccount: clusterAccount,
                systemProgram: SystemProgram.programId,
                arciumProgram: getArciumProgAddress(),
            })
            .transaction()

        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash()
        tx.recentBlockhash = blockhash
        tx.feePayer = walletPublicKey

        console.log("[v0] Signing claim transaction...")
        const signedTx = await signTransaction(tx)

        console.log("[v0] Sending claim transaction...")
        const signature = await connection.sendRawTransaction(signedTx.serialize())

        console.log("[v0] Confirming claim transaction...")
        await connection.confirmTransaction(signature, "confirmed")

        console.log("[v0] Claim transaction successful:", signature)
        return signature
    } catch (error) {
        console.error("[v0] Claim rewards error:", error)
        throw error
    }
}