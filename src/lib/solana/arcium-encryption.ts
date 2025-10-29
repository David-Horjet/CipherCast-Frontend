import { getMXEPublicKey, RescueCipher, x25519 } from "@arcium-hq/client"
import { randomBytes } from "crypto"
import * as anchor from "@coral-xyz/anchor"

export interface EncryptedData {
  ciphertext: Uint8Array
  publicKey: Uint8Array
  nonce: Uint8Array
}

/**
 * Encrypt a price prediction using Arcium's MPC encryption
 * @param price - The numeric prediction value
 * @param provider - Anchor provider instance
 * @param programId - Program ID of your deployed Solana program
 */
export async function encryptPrediction(
  price: number,
  provider: anchor.AnchorProvider,
  programId: anchor.web3.PublicKey
): Promise<EncryptedData> {
  try {
    // Fetch the MXE cluster public key (x25519)
    const mxePublicKey = await getMXEPublicKey(provider, programId)
    if (!mxePublicKey) {
        throw new Error("mxePublicKey not found")
    }

    // Convert prediction price to BigInt array for encryption
    const plaintext = [BigInt(price)]

    // Generate x25519 key pair
    const privateKey = x25519.utils.randomSecretKey()
    const publicKey = x25519.getPublicKey(privateKey)

    // Generate nonce
    const nonce = randomBytes(16)

    // Derive shared secret between user and MXE cluster
    const sharedSecret = x25519.getSharedSecret(privateKey, mxePublicKey)

    // Initialize cipher and encrypt
    const cipher = new RescueCipher(sharedSecret)

    // Arcium returns number[][], so flatten it
    const encryptedArray = cipher.encrypt(plaintext, nonce)
    const ciphertext = new Uint8Array(encryptedArray.flat())

    return {
      ciphertext,
      publicKey: new Uint8Array(publicKey),
      nonce,
    }
  } catch (error) {
    console.error("[v0] Encryption error:", error)
    throw new Error("Failed to encrypt prediction")
  }
}
