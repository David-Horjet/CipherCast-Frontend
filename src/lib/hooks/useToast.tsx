"use client"

import { ToastProps } from "@/components/ui/Toast"
import type React from "react"

import { useState, useCallback, createContext, useContext } from "react"

let toastId = 0

interface ToastContextType {
  toasts: ToastProps[]
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = `toast-${toastId++}`
    const newToast: ToastProps = {
      id,
      message,
      type,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const success = useCallback((message: string) => addToast(message, "success"), [addToast])
  const error = useCallback((message: string) => addToast(message, "error"), [addToast])
  const info = useCallback((message: string) => addToast(message, "info"), [addToast])

  return <ToastContext.Provider value={{ toasts, success, error, info }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
