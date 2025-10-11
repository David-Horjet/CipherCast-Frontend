"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const socialLinks = [
  { name: "Twitter", href: "#", icon: "𝕏" },
  { name: "Discord", href: "#", icon: "💬" },
  { name: "Telegram", href: "#", icon: "✈️" },
  { name: "GitHub", href: "#", icon: "⚡" },
]

const footerLinks = [
  { name: "Documentation", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Contact", href: "#" },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <span className="font-mono text-2xl font-bold text-white">C</span>
                </div>
              </div>
              <span className="font-sans text-2xl font-bold tracking-tight text-foreground">
                Cypher<span className="text-primary">Cast</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Predict crypto prices, stake USDC, and compete for rewards on the most advanced prediction platform.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground">Community</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/20 border border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Join our community and stay updated with the latest news</p>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CypherCast. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Built with</span>
              <span className="text-primary">♥</span>
              <span>for the crypto community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
