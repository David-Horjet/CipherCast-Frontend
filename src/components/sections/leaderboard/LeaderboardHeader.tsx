"use client"

import { motion } from "framer-motion"

export function LeaderboardHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Global Leaderboard</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
        Top predictors ranked by accuracy and total rewards earned
      </p>
    </motion.div>
  )
}
