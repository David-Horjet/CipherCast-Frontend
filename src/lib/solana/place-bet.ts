import { Program, BN, AnchorProvider } from "@coral-xyz/anchor"
import {
    PublicKey,
    SystemProgram,
    Transaction,
    Connection
} from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import type { SwivPrivacy } from "@/lib/types/idl"
import IDL from "@/lib/idl/idl.json"
import { encryptPrediction } from "./arcium-encryption"
import { getArciumProgramId, getClockAccAddress, getExecutingPoolAccAddress } from "@arcium-hq/client"
import { randomBytes } from "crypto"

const PROGRAM_ID = new PublicKey("729ib6LPCHmj13pZA2F1airFN23pG3diK4bWUTaxw3Fz")

export interface PlaceBetParams {
    poolId: number
    predictedPrice: number
    stakeAmount: number
}

export async function placeEncryptedBet(
    connection: Connection,
    embeddedWallet: any,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
    params: PlaceBetParams,
): Promise<string> {
    try {
        console.log("[v0] Starting encrypted bet placement...", embeddedWallet)
        const walletPublicKey = new PublicKey(embeddedWallet.address)

        // Get user's token account (USDC)
        const usdcMint = new PublicKey(process.env.NEXT_PUBLIC_USDC_TOKEN_MINT!)
        const userTokenAccount = await getAssociatedTokenAddress(usdcMint, walletPublicKey)

        console.log("[v0] Encrypting prediction...")

        // ✅ Properly construct provider
        // ✅ Wrap Privy wallet to satisfy Anchor's Wallet interface
        // const walletPublicKey = new PublicKey(embeddedWallet.address)

        const wallet = {
            publicKey: walletPublicKey,
            signTransaction: embeddedWallet.signTransaction.bind(embeddedWallet),
            signAllTransactions: async (txs: Transaction[]) => {
                return Promise.all(txs.map(tx => embeddedWallet.signTransaction(tx)))
            },
        }

        // ✅ Proper Anchor provider
        const provider = new AnchorProvider(
            connection,
            wallet as any,
            AnchorProvider.defaultOptions(),
        )

        const encryptedData = await encryptPrediction(params.predictedPrice, provider, PROGRAM_ID)

        console.log("[v0] Encrypted data prepared")

        console.log("[v0] Encrypted data prepared")
        console.log("[v0] ciphertext len:", encryptedData.ciphertext.length)
        console.log("[v0] pubkey len:", encryptedData.publicKey.length)
        console.log("[v0] nonce len:", encryptedData.nonce.length)
        console.log("[v0] ciphertext hex (first 32):", Buffer.from(encryptedData.ciphertext).toString("hex").slice(0, 64))
        console.log("[v0] pubkey hex:", Buffer.from(encryptedData.publicKey).toString("hex"))

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

        const [signPdaAccount] = PublicKey.findProgramAddressSync([Buffer.from("SignerAccount")], PROGRAM_ID)

        const MXE_PDA_SEED = Buffer.from("mxe_pda");

        // ✅ Proper program initialization
        const program = new Program<SwivPrivacy>(IDL as SwivPrivacy, provider)

        const [mxeAccount] = PublicKey.findProgramAddressSync(
            [MXE_PDA_SEED],
            PROGRAM_ID
        );

        const [mempoolAccount] = PublicKey.findProgramAddressSync(
            [Buffer.from("mempool")],
            PROGRAM_ID
        );

        const [executingPool] = PublicKey.findProgramAddressSync(
            [Buffer.from("executing_pool")],
            PROGRAM_ID
        );

        const computationOffset = new BN(0)

        const [computationAccount] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("computation"),
                computationOffset.toArrayLike(Buffer, "le", 8),
            ],
            PROGRAM_ID
        );

        const COMP_DEF_OFFSET_PROCESS_BET = 0;

        const [compDefAccount] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("comp_def"),
                new BN(COMP_DEF_OFFSET_PROCESS_BET).toArrayLike(Buffer, "le", 4),
            ],
            PROGRAM_ID
        );

        const [clusterAccount] = PublicKey.findProgramAddressSync(
            [Buffer.from("cluster"), mxeAccount.toBuffer()],
            PROGRAM_ID
        );

        const poolAccount = getExecutingPoolAccAddress(mxeAccount);
        const clockAccount = getClockAccAddress();
        const ARCIUM_PROGRAM_ID = getArciumProgramId();
        // console.log(ARCIUM_PROGRAM_ID.toBase58());

        // Convert nonce (Uint8Array length 16) into BN using little-endian order (u128)
        const nonceUint8 = Buffer.from(encryptedData.nonce) // Buffer of length 16
        // BN constructor: new BN(buffer, base?, endian?) — use 'le' for little-endian
        const bnNonce = new BN(nonceUint8, undefined, "le") // bn now holds the u128 number
        console.log("mxeAccount:", mxeAccount.toBase58())
        
        const tx = await program.methods
            .placeEncryptedBet(
                computationOffset,
                Array.from(encryptedData.ciphertext),
                Array.from(encryptedData.publicKey),
                bnNonce,
            )
            .accounts({
                pool: new PublicKey(poolPda),
                poolVault: poolVaultPda,
                bet: betPda,
                userTokenAccount,
                user: walletPublicKey,
                payer: walletPublicKey,
                signPdaAccount: signPdaAccount,
                mxeAccount: mxeAccount,
                mempoolAccount: mempoolAccount,
                executingPool: executingPool,
                computationAccount: computationAccount,
                compDefAccount: compDefAccount,
                clusterAccount: clusterAccount,
                poolAccount: poolAccount,
                clockAccount: clockAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                arciumProgram: ARCIUM_PROGRAM_ID
            })
            .transaction()

        console.log("[v0] Transaction constructed, preparing to sign...", tx)

        const { blockhash } = await connection.getLatestBlockhash()
        tx.recentBlockhash = blockhash
        tx.feePayer = walletPublicKey

        console.log("[v0] Signing transaction with Privy wallet...")
        const signedTx = await signTransaction(tx)
        const signature = await connection.sendRawTransaction(signedTx.serialize())
        await connection.confirmTransaction(signature, "confirmed")

        console.log("[v0] Transaction successful:", signature)
        return signature
    } catch (error) {
        console.error("[v0] Place bet error:", error);

        if ("logs" in error) {
            console.error("Transaction logs:", error.logs);
        } else if (error.getLogs) {
            const logs = await error.getLogs();
            console.error("Detailed logs:", logs);
        }

        throw error;
    }
}
