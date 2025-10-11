"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description: "Link your wallet securely using Privy authentication. Your funds remain in your control.",
    icon: "🔐",
  },
  {
    number: "02",
    title: "Choose a Pool",
    description: "Browse active prediction pools for Bitcoin, Ethereum, and other major cryptocurrencies.",
    icon: "🎯",
  },
  {
    number: "03",
    title: "Make Prediction",
    description: "Stake USDC and predict the future price. The more accurate you are, the bigger your reward.",
    icon: "💎",
  },
  {
    number: "04",
    title: "Earn Rewards",
    description: "When the pool closes, rewards are distributed based on prediction accuracy. Winners take all.",
    icon: "🏆",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">How It Works</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Start predicting and earning in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative group"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent -translate-x-1/2 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}

              <div className="relative z-10 p-8 rounded-2xl bg-card/80 dark:bg-card/10 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent border border-primary/30 text-white font-mono font-bold text-xl mb-6 shadow-lg shadow-primary/20">
                  {step.number}
                </div>

                {/* Icon */}
                {/* <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div> */}

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
