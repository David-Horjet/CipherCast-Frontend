import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Prediction {
  id: string
  poolId: string
  asset: string
  predictedPrice: number
  actualPrice?: number
  stake: number
  reward?: number
  accuracy?: number
  timestamp: string
  status: "active" | "completed"
}

interface PredictionsState {
  predictions: Prediction[]
}

const initialState: PredictionsState = {
  predictions: [],
}

// Load from localStorage if available
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("cyphercast_predictions")
  if (saved) {
    try {
      Object.assign(initialState, JSON.parse(saved))
    } catch (e) {
      console.error("Failed to parse saved predictions")
    }
  }
}

const predictionsSlice = createSlice({
  name: "predictions",
  initialState,
  reducers: {
    addPrediction: (state, action: PayloadAction<Prediction>) => {
      state.predictions.unshift(action.payload)
      if (typeof window !== "undefined") {
        localStorage.setItem("cyphercast_predictions", JSON.stringify(state))
      }
    },
    updatePrediction: (state, action: PayloadAction<Prediction>) => {
      const index = state.predictions.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.predictions[index] = action.payload
        if (typeof window !== "undefined") {
          localStorage.setItem("cyphercast_predictions", JSON.stringify(state))
        }
      }
    },
  },
})

export const { addPrediction, updatePrediction } = predictionsSlice.actions
export default predictionsSlice.reducer
