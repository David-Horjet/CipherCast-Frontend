"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PageLayout } from "@/components/layout/PageLayout"
import { ParticipantsTable } from "@/components/sections/pools-details/ParticipantsTable"
import { PoolDetailsHeader } from "@/components/sections/pools-details/PoolDetilasHeader"
import { PoolStats } from "@/components/sections/pools-details/PoolStats"
import { PredictionModal } from "@/components/sections/pools-details/PredictionModal"
import { PriceChart } from "@/components/sections/pools-details/PriceChart"
import { LoadingScreen } from "@/components/ui/LoadigSpinner"
import { fetchHistoricalPrices } from "@/lib/api/coingecko"
import { mockPools } from "@/lib/data/mockData"
import { Pool } from "@/lib/store/slices/poolsSlice"

export default function PoolDetailsPage() {
  const params = useParams()
  const [pool, setPool] = useState<Pool | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [historicalData, setHistoricalData] = useState<Array<{ timestamp: number; price: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPoolData = async () => {
      const foundPool = mockPools.find((p) => p.id === params.id)
      if (foundPool) {
        setPool(foundPool)

        // Fetch historical prices for BTC and ETH
        if (foundPool.symbol === "BTC") {
          const data = await fetchHistoricalPrices("bitcoin", 30)
          setHistoricalData(data)
        } else if (foundPool.symbol === "ETH") {
          const data = await fetchHistoricalPrices("ethereum", 30)
          setHistoricalData(data)
        }
      }
      setLoading(false)
    }

    loadPoolData()
  }, [params.id])

  if (loading) {
    return <LoadingScreen />
  }

  if (!pool) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Pool not found</h2>
            <p className="text-muted-foreground">The pool you're looking for doesn't exist</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PoolDetailsHeader pool={pool} onPredict={() => setShowModal(true)} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PriceChart pool={pool} historicalData={historicalData} />
            </div>
            <div>
              <PoolStats pool={pool} />
            </div>
          </div>

          <ParticipantsTable poolId={pool.id} />
        </div>
      </div>

      {showModal && <PredictionModal pool={pool} onClose={() => setShowModal(false)} />}
    </PageLayout>
  )
}
