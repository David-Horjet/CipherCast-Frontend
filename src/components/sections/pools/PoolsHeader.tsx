"use client"

import { motion } from "framer-motion"

export function PoolsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">Prediction Pools</h1>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
        Choose a pool, stake USDC, and predict future crypto & stock prices to earn rewards
      </p>
    </motion.div>
  )
}
