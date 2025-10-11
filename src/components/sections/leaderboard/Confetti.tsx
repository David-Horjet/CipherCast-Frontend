"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-0 left-1/2"
          initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
          animate={{
            y: [0, -100, -200],
            x: [0, particle.x, particle.x * 1.5],
            opacity: [1, 1, 0],
            scale: [1, 0.8, 0.5],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: ["#8b5cf6", "#7c3aed", "#fbbf24", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 5)],
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
