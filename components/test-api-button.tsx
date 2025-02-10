"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function TestApiButton() {
  const router = useRouter()

  const handleClick = async () => {
    try {
      const response = await fetch('/api/check-verification')
      const data = await response.json()
      
      if (data.isVerified) {
        router.push('/dashboard')
      } else {
        router.push('/security')
      }
    } catch (error) {
      console.error('Error checking verification:', error)
      router.push('/security')
    }
  }

  return (
    <Button size="lg" className="bg-black text-white hover:bg-black/100" onClick={handleClick}>
      Test Your API
    </Button>
  )
}
