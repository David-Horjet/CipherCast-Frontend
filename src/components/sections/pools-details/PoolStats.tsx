"use client"

import { motion } from "framer-motion"
import type { Pool } from "@/lib/store/slices/poolsSlice"
import { useEffect, useState } from "react"

interface PoolStatsProps {
  pool: Pool
}

export function PoolStats({ pool }: PoolStatsProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const deadline = new Date(pool.deadline)
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Ended")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [pool.deadline])

  const stats = [
    {
      label: "Pool Size",
      value: `$${pool.poolSize.toLocaleString()}`,
      icon: "💰",
    },
    {
      label: "Participants",
      value: `${pool.participants.toLocaleString()}`,
      icon: "👥",
    },
    // ...(pool.entryFee
    //   ? [
    //       {
    //         label: "Entry Fee",
    //         value: `$${pool.entryFee.toLocaleString()}`,
    //         icon: "🎫",
    //       },
    //     ]
    //   : []),
    {
      label: "Time Left",
      value: timeLeft,
      icon: "⏰",
    },
    // {
    //   label: "Current Price",
    //   value: pool.currentPrice ? `$${pool.currentPrice.toLocaleString()}` : "Loading...",
    //   icon: "📊",
    // },
    // ...(pool.targetPrice
    //   ? [
    //       {
    //         label: "Target Price",
    //         value: `$${pool.targetPrice.toLocaleString()}`,
    //         icon: "🎯",
    //       },
    //     ]
    //   : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground mb-4">Pool Statistics</h2>

      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
        >
          <div className="flex items-center gap-3 mb-2">
            {/* <span className="text-2xl">{stat.icon}</span> */}
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
        </div>
      ))}

      {/* Deadline info */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="text-sm text-muted-foreground mb-1">Deadline</div>
        <div className="text-base font-semibold text-primary">
          {new Date(pool.deadline).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  )
}
