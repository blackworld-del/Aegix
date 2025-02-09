"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"

export default function SecurityScreen() {
  const router = useRouter()
  const [inputKey, setInputKey] = useState('')
  const [error, setError] = useState<string>('')
  const [attemptsMessage, setAttemptsMessage] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: inputKey })
      })

      const data = await response.json()

      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Invalid security key')
        setInputKey('')
      }
    } catch (error) {
      setError('Error verifying key')
      console.error('Error:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className={cn("flex flex-col gap-6", "w-full max-w-sm")}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a href="/" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black">
                  <GalleryVerticalEnd className="size-6 text-white" />
                </div>
                <span className="sr-only">Aegix Security</span>
              </a>
              <h1 className="text-xl font-bold">Security Verification</h1>
              <div className="text-center text-sm text-gray-500">
                Enter your security key to proceed
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="secretKey">Security Key</Label>
                <Input 
                  id="secretKey" 
                  type="text" 
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter your security key"
                  required 
                  disabled={isVerifying}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        </form>
        <div className="text-balance text-center text-xs text-gray-500">
          This is a security checkpoint. Please enter your security key to access the dashboard.
        </div>
      </div>
    </div>
  )
}
