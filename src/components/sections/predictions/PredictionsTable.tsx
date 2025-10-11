"use client"

import { motion } from "framer-motion"
import type { Prediction } from "@/lib/store/slices/predictionsSlice"
import Link from "next/link"

interface PredictionsTableProps {
  predictions: Prediction[]
}

export function PredictionsTable({ predictions }: PredictionsTableProps) {
  const getStatusBadge = (status: Prediction["status"]) => {
    const styles = {
      active: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      completed: "bg-green-500/10 border-green-500/20 text-green-400",
    }

    const labels = {
      active: "Active",
      completed: "Completed",
    }

    return <div className={`px-3 py-1 rounded-lg border text-xs font-medium ${styles[status]}`}>{labels[status]}</div>
  }

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return "text-muted-foreground"
    if (accuracy >= 95) return "text-green-400"
    if (accuracy >= 85) return "text-yellow-400"
    return "text-orange-400"
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (predictions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No predictions yet</h3>
        <p className="text-muted-foreground mb-6">Start making predictions to see them here</p>
        <Link
          href="/pools"
          className="inline-flex px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-xl transition-smooth hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
        >
          Explore Pools
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl border border-border"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">All Predictions</h2>
        <p className="text-sm text-muted-foreground">Your prediction history and performance</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Asset</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Predicted</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actual</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Accuracy</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Stake</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Reward</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => (
              <motion.tr
                key={prediction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/pools/${prediction.poolId}`}
                    className="font-semibold text-foreground hover:text-primary transition-smooth"
                  >
                    {prediction.asset}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-foreground">
                    ${prediction.predictedPrice.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-foreground">
                    {prediction.actualPrice ? `$${prediction.actualPrice.toLocaleString()}` : "-"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-semibold text-sm ${getAccuracyColor(prediction.accuracy)}`}>
                    {prediction.accuracy ? `${prediction.accuracy.toFixed(1)}%` : "-"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-foreground">${prediction.stake.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold text-green-400">
                    {prediction.reward ? `$${prediction.reward.toLocaleString()}` : "-"}
                  </span>
                </td>
                <td className="py-3 px-4">{getStatusBadge(prediction.status)}</td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">{formatDate(prediction.timestamp)}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
