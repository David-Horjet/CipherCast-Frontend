import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface WalletState {
  address: string | null
  isConnected: boolean
  balance: number
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  balance: 0,
}

// Load from localStorage if available
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("cyphercast_wallet")
  if (saved) {
    try {
      Object.assign(initialState, JSON.parse(saved))
    } catch (e) {
      console.error("Failed to parse saved wallet state")
    }
  }
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string; balance: number }>) => {
      state.address = action.payload.address
      state.isConnected = true
      state.balance = action.payload.balance
      if (typeof window !== "undefined") {
        localStorage.setItem("cyphercast_wallet", JSON.stringify(state))
      }
    },
    disconnectWallet: (state) => {
      state.address = null
      state.isConnected = false
      state.balance = 0
      if (typeof window !== "undefined") {
        localStorage.removeItem("cyphercast_wallet")
      }
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("cyphercast_wallet", JSON.stringify(state))
      }
    },
  },
})

export const { connectWallet, disconnectWallet, updateBalance } = walletSlice.actions
export default walletSlice.reducer
