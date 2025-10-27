"use client"

import { motion } from "framer-motion"

interface PoolsFiltersProps {
  currentFilter: "all" | "ongoing" | "upcoming" | "closed"
  onFilterChange: (filter: "all" | "ongoing" | "upcoming" | "closed") => void
}

const filters = [
  { value: "all" as const, label: "All Pools", icon: "🎯" },
  { value: "ongoing" as const, label: "Live", icon: "🔴" },
  // { value: "upcoming" as const, label: "Upcoming", icon: "⏰" },
  { value: "closed" as const, label: "Closed", icon: "✅" },
]

export function PoolsFilters({ currentFilter, onFilterChange }: PoolsFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-12"
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`relative px-8 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${
                isActive
                  ? "text-white bg-gradient-to-r from-primary to-accent shadow-xl shadow-primary/40 scale-105"
                  : "text-muted-foreground hover:text-foreground border border-border hover:border-primary/30"
              }`}
            >
              <span className="flex items-center gap-2">
                {/* <span className="text-base">{filter.icon}</span> */}
                {filter.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
