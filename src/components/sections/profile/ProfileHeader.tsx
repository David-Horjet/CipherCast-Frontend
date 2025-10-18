"use client"

import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { useAppSelector } from "@/lib/store/hooks"

export default function ProfileHeader() {
  const { user } = usePrivy()
  const balance = useAppSelector((state) => state.wallet.balance)
  const predictions = useAppSelector((state) => state.predictions.predictions)

  const walletAddress = user?.wallet?.address || ""
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ""

  // Calculate total rewards
  const totalRewards = predictions.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.reward || 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {shortAddress.slice(0, 2).toUpperCase()}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Portfolio</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">{shortAddress}</span>
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                title="Copy address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Predictions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Rewards</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalRewards.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
