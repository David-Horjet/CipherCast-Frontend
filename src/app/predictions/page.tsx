"use client"

import { PageLayout } from "@/components/layout/PageLayout"
import { PredictionsHeader } from "@/components/sections/predictions/PredictionsHeader"
import { PredictionsStats } from "@/components/sections/predictions/PredictionsStats"
import { PredictionsTable } from "@/components/sections/predictions/PredictionsTable"
import { mockPredictions } from "@/lib/data/mockData"
import { useAppSelector } from "@/lib/store/hooks"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"


export default function PredictionsPage() {
  const { isConnected } = useAppSelector((state) => state.wallet)
  const { predictions } = useAppSelector((state) => state.predictions)

  if (!isConnected) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="text-6xl flex justify-center mb-4"><Lock/></div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Please connect your wallet to view your predictions</p>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PredictionsHeader />
          <PredictionsStats predictions={mockPredictions} />
          <PredictionsTable predictions={mockPredictions} />
        </div>
      </div>
    </PageLayout>
  )
}
