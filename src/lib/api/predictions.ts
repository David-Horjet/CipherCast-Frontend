const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.swiv.xyz"

export interface CreatePredictionRequest {
  poolId: string
  userWallet: string
  predictedPrice: string
  amount: string
}

export interface CreatePredictionResponse {
  status: string
  message: string
  data: {
    id: string
    pool_id: string
    user_wallet: string
    predicted_price: number
    amount: number
    reward: number | null
    status: string
    created_at: string
  }
}

export async function createPrediction(data: CreatePredictionRequest): Promise<CreatePredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predictions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create prediction")
  }

  return response.json()
}

export interface PredictionsResponse {
  status: string
  message: string
  data: {
    stats: {
      activePredictions: number
      totalStaked: number
      totalRewards: number
      avgAccuracy: number
    }
    predictions: Array<{
      id: string
      pool_id: string
      user_wallet: string
      amount: number
      reward: number | null
      status: "pending" | "completed"
      created_at: string
      pools: {
        id: string
        asset_symbol: string
        target_price: number
        final_price: number | null
        status: string
      }
    }>
  }
}

export async function fetchUserPredictions(walletAddress: string): Promise<PredictionsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predictions/${walletAddress}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch predictions")
  }

  return response.json()
}
