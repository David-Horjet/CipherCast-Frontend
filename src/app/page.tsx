"use client"

import { PageLayout } from "@/components/layout/PageLayout"
import { ActivePoolsSection } from "@/components/sections/landing/ActivePools"
import { HeroSection } from "@/components/sections/landing/Hero"
import { HowItWorksSection } from "@/components/sections/landing/HowItWorks"
// import { StatsSection } from "@/components/sections/landing/Stats"

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      {/* <StatsSection /> */}
      <HowItWorksSection />
      <ActivePoolsSection />
    </PageLayout>
  )
}
