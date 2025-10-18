"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/store/hooks"

export default function BalanceCards() {
  const balance = useAppSelector((state) => state.wallet.balance)
  const predictions = useAppSelector((state) => state.predictions.predictions)

  // Calculate balances
  const activePredictions = predictions.filter((p) => p.status === "active")
  const stakedBalance = activePredictions.reduce((sum, p) => sum + p.stake, 0)

  const completedPredictions = predictions.filter((p) => p.status === "completed")
  const claimableBalance = completedPredictions.reduce((sum, p) => sum + (p.reward || 0), 0)

  const totalPnL = completedPredictions.reduce((sum, p) => {
    const pnl = (p.reward || 0) - p.stake
    return sum + pnl
  }, 0)

  const portfolioValue = balance + stakedBalance + claimableBalance

  const cards = [
    {
      title: "Portfolio Value",
      value: portfolioValue,
      icon: "💼",
      color: "from-violet-500 to-purple-600",
      textColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Cash Balance",
      value: balance,
      icon: "💵",
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Staked",
      value: stakedBalance,
      icon: "🔒",
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Claimable",
      value: claimableBalance,
      icon: "🎁",
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total PnL",
      value: totalPnL,
      icon: totalPnL >= 0 ? "📈" : "📉",
      color: totalPnL >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600",
      textColor: totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      showSign: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:shadow-violet-500/10 dark:hover:shadow-violet-500/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl`}
            >
              {card.icon}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{card.title}</p>
          <p className={`text-2xl font-bold ${card.textColor}`}>
            {card.showSign && card.value >= 0 ? "+" : ""}${Math.abs(card.value).toLocaleString()}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
