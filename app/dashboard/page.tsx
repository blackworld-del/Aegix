"use client"

import { Button } from "@/components/ui/button"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Link from "next/link"

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden bg-white">
      <BackgroundBeams />
      
      <div className="space-y-8 max-w-md mx-auto relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome to Dashboard</h1>
          <p className="text-zinc-500">
            You have successfully passed the security check
          </p>
        </div>

        <Button asChild className="bg-black text-white hover:bg-black/90">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  )
}
