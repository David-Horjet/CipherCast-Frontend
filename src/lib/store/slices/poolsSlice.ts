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
}

interface PoolsState {
  pools: Pool[]
  loading: boolean
}

const initialState: PoolsState = {
  pools: [],
  loading: false,
}

const poolsSlice = createSlice({
  name: "pools",
  initialState,
  reducers: {
    setPools: (state, action: PayloadAction<Pool[]>) => {
      state.pools = action.payload
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
  },
})

export const { setPools, updatePoolPrice, setLoading } = poolsSlice.actions
export default poolsSlice.reducer
