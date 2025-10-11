"use client"

import { motion } from "framer-motion"

const stats = [
  {
    label: "Total Volume",
    value: "$12.5M",
    change: "+24.5%",
    icon: "📊",
  },
  {
    label: "Active Users",
    value: "3,247",
    change: "+18.2%",
    icon: "👥",
  },
  {
    label: "Avg. Accuracy",
    value: "87.3%",
    change: "+5.1%",
    icon: "🎯",
  },
  {
    label: "Rewards Paid",
    value: "$4.2M",
    change: "+32.8%",
    icon: "💰",
  },
]

export function StatsSection() {
  return (
    <section className="relative py-24 border-y border-border/50 bg-gradient-to-b from-card/30 via-card/50 to-card/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-64 w-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative p-6 lg:p-8 rounded-2xl bg-card/80 dark:bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-3 font-medium">{stat.label}</div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-500 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
