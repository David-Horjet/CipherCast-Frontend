"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { connectWallet, disconnectWallet } from "@/lib/store/slices/walletSlice"
import { useTheme } from "@/lib/contexts/ThemeContext"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pools", label: "Pools" },
  { href: "/predictions", label: "My Predictions" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export function Navbar() {
  const pathname = usePathname()
  const { ready, authenticated, user, login, logout } = usePrivy()
  const dispatch = useAppDispatch()
  const { isConnected, address } = useAppSelector((state) => state.wallet)
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (authenticated && user?.wallet?.address && !isConnected) {
      dispatch(
        connectWallet({
          address: user.wallet.address,
          balance: 10000,
        }),
      )
    } else if (!authenticated && isConnected) {
      dispatch(disconnectWallet())
    }
  }, [authenticated, user, isConnected, dispatch])

  const handleConnect = async () => {
    if (authenticated) {
      await logout()
    } else {
      await login()
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="fixed z-50 top-0 left-0 right-0 w-full flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-between bg-background/95 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4 shadow-lg pointer-events-auto border border-border/50
          transition-all duration-500 ease-in-out
          ${
            scrolled
              ? "w-full max-w-full rounded-none shadow-md translate-y-0"
              : "w-[95%] max-w-6xl mt-6 rounded-2xl shadow-xl"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-smooth" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <span className="font-mono text-xl font-bold text-white">C</span>
            </div>
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-foreground">
            Cypher<span className="text-primary">Cast</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-smooth rounded-lg ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border hover:border-primary/50 transition-smooth"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={!ready}
            className="relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-xl transition-smooth hover:shadow-lg hover:shadow-primary/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!ready ? (
              "Loading..."
            ) : authenticated && address ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                {formatAddress(address)}
              </span>
            ) : (
              "Connect Wallet"
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-smooth"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 mt-2 md:hidden bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-4 space-y-2"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium transition-smooth rounded-lg ${
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </motion.nav>
    </header>
  )
}
