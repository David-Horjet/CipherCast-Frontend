"use client"

import { motion } from "framer-motion"

export function PredictionsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">My Predictions</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
        Track your active and completed predictions, view accuracy, and monitor rewards
      </p>
    </motion.div>
  )
}
