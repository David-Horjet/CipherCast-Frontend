const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.swiv.xyz"

export interface PoolResponse {
  id: string
  asset_symbol: string
  target_price: number
  final_price: number | null
  end_time: string
  status: "active" | "closed"
  creator: string
  created_at: string
  blockchain_signature: string
  pool_pubkey: string
  vault_pubkey: string
  poolid: number
  entry_fee: number
  max_participants: number
  total_participants?: number
  total_pool_amount?: number
}

export interface PoolsApiResponse {
  status: string
  message: string
  data: PoolResponse[]
}

export interface PoolApiResponse {
  status: string
  message: string
  data: PoolResponse
}

// Convert lamports to USDC (assuming 1 USDC = 1,000,000 lamports)
const lamportsToUSDC = (lamports: number): number => {
  return lamports / 1_000_000
}

// Get asset name from symbol
const getAssetName = (symbol: string): string => {
  const assetMap: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    ADA: "Cardano",
    DOT: "Polkadot",
    AVAX: "Avalanche",
  }
  return assetMap[symbol] || symbol
}

// Get asset icon from symbol
const getAssetIcon = (symbol: string): string => {
  const iconMap: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    SOL: "◎",
    ADA: "₳",
    DOT: "●",
    AVAX: "▲",
  }
  return iconMap[symbol] || "●"
}

// Map API status to frontend status
const mapStatus = (apiStatus: "active" | "closed"): "ongoing" | "upcoming" | "closed" => {
  if (apiStatus === "active") {
    return "ongoing"
  }
  return "closed"
}

export const getAllPools = async (status?: "active" | "closed") => {
  try {
    const url = status ? `${API_BASE_URL}/api/pools?status=${status}` : `${API_BASE_URL}/api/pools`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch pools")
    }

    const result: PoolsApiResponse = await response.json()

    // Transform API response to match frontend Pool interface
    return result.data.map((pool) => ({
      id: pool.id,
      asset: getAssetName(pool.asset_symbol),
      symbol: pool.asset_symbol,
      poolSize: pool.total_pool_amount
        ? lamportsToUSDC(pool.total_pool_amount)
        : lamportsToUSDC(pool.entry_fee * pool.max_participants),
      participants: pool.total_participants || 0,
      deadline: pool.end_time,
      status: mapStatus(pool.status),
      currentPrice: undefined, // Will be fetched from CoinGecko
      icon: getAssetIcon(pool.asset_symbol),
      // Store blockchain-specific data
      targetPrice: pool.target_price,
      finalPrice: pool.final_price,
      entryFee: lamportsToUSDC(pool.entry_fee),
      maxParticipants: pool.max_participants,
      poolPubkey: pool.pool_pubkey,
      vaultPubkey: pool.vault_pubkey,
      poolId: pool.poolid,
      blockchainSignature: pool.blockchain_signature,
      creator: pool.creator,
    }))
  } catch (error) {
    console.error("[v0] Error fetching pools:", error)
    throw error
  }
}

export const getPoolById = async (poolId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pools/${poolId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch pool")
    }

    const result: PoolApiResponse = await response.json()
    const pool = result.data

    // Transform API response to match frontend Pool interface
    return {
      id: pool.id,
      asset: getAssetName(pool.asset_symbol),
      symbol: pool.asset_symbol,
      poolSize: pool.total_pool_amount
        ? lamportsToUSDC(pool.total_pool_amount)
        : lamportsToUSDC(0),
      participants: pool.total_participants || 0,
      deadline: pool.end_time,
      status: mapStatus(pool.status),
      currentPrice: undefined, // Will be fetched from CoinGecko
      icon: getAssetIcon(pool.asset_symbol),
      // Store blockchain-specific data
      targetPrice: pool.target_price,
      finalPrice: pool.final_price,
      entryFee: lamportsToUSDC(pool.entry_fee),
      maxParticipants: pool.max_participants,
      poolPubkey: pool.pool_pubkey,
      vaultPubkey: pool.vault_pubkey,
      poolId: pool.poolid,
      blockchainSignature: pool.blockchain_signature,
      creator: pool.creator,
    }
  } catch (error) {
    console.error("[v0] Error fetching pool:", error)
    throw error
  }
}
