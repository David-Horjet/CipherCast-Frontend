import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./slices/walletSlice"
import poolsReducer from "./slices/poolsSlice"
import predictionsReducer from "./slices/predictionsSlice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    pools: poolsReducer,
    predictions: predictionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
