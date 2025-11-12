import { PoolResponse } from "./pools"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.swiv.xyz"

export interface CreatePredictionRequest {
  poolId: string
  userWallet: string
  amount: string
}

export interface CreatePredictionResponse {
  status: string
  message: string
  data: {
    id: string
    pool_id: string
    user_wallet: string
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
      pools: PoolResponse
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

export async function claimReward(
  predictionId: string,
): Promise<{ status: string; message: string; data: { reward: number; status: string } }> {
  const response = await fetch(`${API_BASE_URL}/api/predictions/${predictionId}/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to claim reward")
  }

  return response.json()
}