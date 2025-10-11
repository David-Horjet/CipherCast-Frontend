"use client"

import { Pool } from "@/lib/store/slices/poolsSlice"
import { motion } from "framer-motion"
import Link from "next/link"

interface PoolsGridProps {
  pools: Pool[]
}

export function PoolsGrid({ pools }: PoolsGridProps) {
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    return "Ended"
  }

  const getStatusBadge = (status: Pool["status"]) => {
    const styles = {
      ongoing: "bg-green-500/10 border-green-500/30 text-green-500 dark:text-green-400 shadow-lg shadow-green-500/10",
      upcoming: "bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400 shadow-lg shadow-blue-500/10",
      closed: "bg-gray-500/10 border-gray-500/30 text-gray-500 dark:text-gray-400",
    }

    const labels = {
      ongoing: "LIVE",
      upcoming: "UPCOMING",
      closed: "CLOSED",
    }

    return <div className={`px-4 py-2 rounded-xl border text-xs font-bold ${styles[status]}`}>{labels[status]}</div>
  }

  if (pools.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32">
        <div className="text-7xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No pools found</h3>
        <p className="text-muted-foreground text-lg">Try adjusting your filters</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pools.map((pool, index) => (
        <motion.div
          key={pool.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative p-8 rounded-3xl bg-card/80 dark:bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-3xl shadow-lg">
                  {pool.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{pool.asset}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{pool.symbol}</p>
                </div>
              </div>
              {getStatusBadge(pool.status)}
            </div>

            {/* Current Price */}
            {pool.currentPrice && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                  Current Price
                </div>
                <div className="text-2xl font-bold text-primary font-mono">${pool.currentPrice.toLocaleString()}</div>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 dark:bg-muted/30">
                <span className="text-sm text-muted-foreground font-medium">Pool Size</span>
                <span className="text-sm font-bold text-foreground">${pool.poolSize.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 dark:bg-muted/30">
                <span className="text-sm text-muted-foreground font-medium">Participants</span>
                <span className="text-sm font-bold text-foreground">{pool.participants}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 dark:bg-muted/30">
                <span className="text-sm text-muted-foreground font-medium">
                  {pool.status === "closed" ? "Ended" : "Time Left"}
                </span>
                <span
                  className={`text-sm font-bold ${pool.status === "closed" ? "text-muted-foreground" : "text-primary"}`}
                >
                  {formatDeadline(pool.deadline)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/pools/${pool.id}`}
              className={`block w-full py-4 text-center text-sm font-bold rounded-2xl transition-all duration-300 ${
                pool.status === "closed"
                  ? "text-muted-foreground bg-muted cursor-not-allowed"
                  : "text-white bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
              }`}
            >
              {pool.status === "closed" ? "View Results" : "Join Pool"}
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
