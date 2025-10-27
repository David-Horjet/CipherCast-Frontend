import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Pool {
  id: string
  asset: string
  symbol: string
  poolSize: number
  participants: number
  deadline: string
  status: "ongoing" | "upcoming" | "closed"
  currentPrice?: number
  icon: string
  // Blockchain-specific fields
  targetPrice?: number
  finalPrice?: number | null
  entryFee?: number
  maxParticipants?: number
  poolPubkey?: string
  vaultPubkey?: string
  poolId?: number
  blockchainSignature?: string
  creator?: string
}

interface PoolsState {
  pools: Pool[]
  loading: boolean
  error: string | null
}

const initialState: PoolsState = {
  pools: [],
  loading: false,
  error: null,
}

const poolsSlice = createSlice({
  name: "pools",
  initialState,
  reducers: {
    setPools: (state, action: PayloadAction<Pool[]>) => {
      state.pools = action.payload
      state.error = null
    },
    updatePoolPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const pool = state.pools.find((p) => p.id === action.payload.id)
      if (pool) {
        pool.currentPrice = action.payload.price
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setPools, updatePoolPrice, setLoading, setError } = poolsSlice.actions
export default poolsSlice.reducer
