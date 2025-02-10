"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import LandingPage from "@/page"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <LandingPage />
    </>
  )
}
