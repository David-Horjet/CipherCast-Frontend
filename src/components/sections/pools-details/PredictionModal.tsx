"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { Pool } from "@/lib/store/slices/poolsSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addPrediction } from "@/lib/store/slices/predictionsSlice"
import { updateBalance } from "@/lib/store/slices/walletSlice"

interface PredictionModalProps {
  pool: Pool
  onClose: () => void
}

export function PredictionModal({ pool, onClose }: PredictionModalProps) {
  const dispatch = useAppDispatch()
  const { balance, address } = useAppSelector((state) => state.wallet)
  const [predictedPrice, setPredictedPrice] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const price = Number.parseFloat(predictedPrice)
    const stake = Number.parseFloat(stakeAmount)

    if (isNaN(price) || isNaN(stake) || stake <= 0 || stake > balance) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add prediction to store
    dispatch(
      addPrediction({
        id: Date.now().toString(),
        poolId: pool.id,
        asset: pool.asset,
        predictedPrice: price,
        stake,
        timestamp: new Date().toISOString(),
        status: "active",
      }),
    )

    // Update balance
    dispatch(updateBalance(balance - stake))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Close modal after success
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl"
        >
          {!showSuccess ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Make Prediction</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pool.asset} ({pool.symbol})
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Close"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Price */}
              {pool.currentPrice && (
                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                  <div className="text-2xl font-bold text-primary font-mono">${pool.currentPrice.toLocaleString()}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Predicted Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                    Your Prediction (USD)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={predictedPrice}
                    onChange={(e) => setPredictedPrice(e.target.value)}
                    placeholder="Enter predicted price"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  />
                </div>

                {/* Stake Amount */}
                <div>
                  <label htmlFor="stake" className="block text-sm font-medium text-foreground mb-2">
                    Stake Amount (USDC)
                  </label>
                  <input
                    id="stake"
                    type="number"
                    step="0.01"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter stake amount"
                    required
                    max={balance}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Available: ${balance.toLocaleString()} USDC</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-xl transition-smooth hover:shadow-xl hover:shadow-primary/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Prediction"
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/50 text-4xl mb-4"
              >
                ✓
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Prediction Submitted!</h3>
              <p className="text-muted-foreground">Your prediction has been recorded successfully</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
