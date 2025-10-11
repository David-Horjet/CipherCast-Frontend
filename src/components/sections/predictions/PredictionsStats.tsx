"use client"

import { motion } from "framer-motion"
import type { Prediction } from "@/lib/store/slices/predictionsSlice"

interface PredictionsStatsProps {
  predictions: Prediction[]
}

export function PredictionsStats({ predictions }: PredictionsStatsProps) {
  const activePredictions = predictions.filter((p) => p.status === "active").length
  const completedPredictions = predictions.filter((p) => p.status === "completed")

  const totalStaked = predictions.reduce((sum, p) => sum + p.stake, 0)
  const totalRewards = completedPredictions.reduce((sum, p) => sum + (p.reward || 0), 0)

  const avgAccuracy =
    completedPredictions.length > 0
      ? completedPredictions.reduce((sum, p) => sum + (p.accuracy || 0), 0) / completedPredictions.length
      : 0

  const stats = [
    {
      label: "Active Predictions",
      value: activePredictions.toString(),
      icon: "🎯",
      color: "text-blue-400",
    },
    {
      label: "Total Staked",
      value: `$${totalStaked.toLocaleString()}`,
      icon: "💰",
      color: "text-green-400",
    },
    {
      label: "Total Rewards",
      value: `$${totalRewards.toLocaleString()}`,
      icon: "🏆",
      color: "text-yellow-400",
    },
    {
      label: "Avg. Accuracy",
      value: `${avgAccuracy.toFixed(1)}%`,
      icon: "📊",
      color: "text-primary",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-smooth" />
          <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-smooth">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
