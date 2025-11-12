const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.cyphercast.com"

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
    status: "active" | "completed"
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
