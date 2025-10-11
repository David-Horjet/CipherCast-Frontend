"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "../store/store"
import { PrivyProvider } from "@privy-io/react-auth"
import { ThemeProvider } from "../contexts/ThemeContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "placeholder-app-id"}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </PrivyProvider>
  )
}
