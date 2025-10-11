"use client"

import { PageLayout } from "@/components/layout/PageLayout"
import { PoolsFilters } from "@/components/sections/pools/PoolsFilter"
import { PoolsGrid } from "@/components/sections/pools/PoolsGrid"
import { PoolsHeader } from "@/components/sections/pools/PoolsHeader"
import { LoadingScreen } from "@/components/ui/LoadigSpinner"
import { fetchBitcoinPrice, fetchCryptoPrice } from "@/lib/api/coingecko"
import { mockPools } from "@/lib/data/mockData"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setLoading, setPools, updatePoolPrice } from "@/lib/store/slices/poolsSlice"
import { useState, useEffect } from "react"

export default function PoolsPage() {
  const dispatch = useAppDispatch()
  const { pools, loading } = useAppSelector((state) => state.pools)
  const [filter, setFilter] = useState<"all" | "ongoing" | "upcoming" | "closed">("all")

  useEffect(() => {
    const loadPools = async () => {
      dispatch(setLoading(true))
      dispatch(setPools(mockPools))

      // Fetch live prices for BTC and ETH
      const btcPrice = await fetchBitcoinPrice()
      const ethPrice = await fetchCryptoPrice("ethereum")

      if (btcPrice) {
        dispatch(updatePoolPrice({ id: "1", price: btcPrice }))
      }
      if (ethPrice) {
        dispatch(updatePoolPrice({ id: "2", price: ethPrice }))
      }

      dispatch(setLoading(false))
    }

    loadPools()
  }, [dispatch])

  const filteredPools = filter === "all" ? pools : pools.filter((pool) => pool.status === filter)

  if (loading && pools.length === 0) {
    return <LoadingScreen />
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PoolsHeader />
          <PoolsFilters currentFilter={filter} onFilterChange={setFilter} />
          <PoolsGrid pools={filteredPools} />
        </div>
      </div>
    </PageLayout>
  )
}
