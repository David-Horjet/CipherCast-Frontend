import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface WalletState {
  address: string | null
  isConnected: boolean
  balance: number
  userId?: string
  username?: string
  email?: string
  avatarUrl?: string
  isEmailVerified?: boolean
  privyUserId?: string
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
    connectWallet: (
      state,
      action: PayloadAction<{
        address: string
        balance: number
        userId?: string
        username?: string
        email?: string
        avatarUrl?: string
        isEmailVerified?: boolean
        privyUserId?: string
      }>,
    ) => {
      state.address = action.payload.address
      state.isConnected = true
      state.balance = action.payload.balance
      state.userId = action.payload.userId
      state.username = action.payload.username
      state.email = action.payload.email
      state.avatarUrl = action.payload.avatarUrl
      state.isEmailVerified = action.payload.isEmailVerified
      state.privyUserId = action.payload.privyUserId
      if (typeof window !== "undefined") {
        localStorage.setItem("cyphercast_wallet", JSON.stringify(state))
      }
    },
    disconnectWallet: (state) => {
      state.address = null
      state.isConnected = false
      state.balance = 0
      state.userId = undefined
      state.username = undefined
      state.email = undefined
      state.avatarUrl = undefined
      state.isEmailVerified = undefined
      state.privyUserId = undefined
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
    updateProfile: (state, action: PayloadAction<{ username?: string; avatarUrl?: string }>) => {
      if (action.payload.username !== undefined) {
        state.username = action.payload.username
      }
      if (action.payload.avatarUrl !== undefined) {
        state.avatarUrl = action.payload.avatarUrl
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cyphercast_wallet", JSON.stringify(state))
      }
    },
  },
})

export const { connectWallet, disconnectWallet, updateBalance, updateProfile } = walletSlice.actions
export default walletSlice.reducer
