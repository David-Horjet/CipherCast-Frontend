"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

export interface ToastProps {
  id: string
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "bg-green-500/10 border-green-500/50",
    error: "bg-red-500/10 border-red-500/50",
    info: "bg-primary/10 border-primary/50",
  }[type]

  const iconColor = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-primary",
  }[type]

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${bgColor} shadow-lg`}
    >
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${iconColor} font-bold`}>{icon}</div>
      <p className="text-sm font-medium text-foreground">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-muted-foreground hover:text-foreground transition-smooth"
        aria-label="Close"
      >
        ✕
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
