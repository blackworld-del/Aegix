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
        // Use window.location for a hard redirect after cookie is set
        window.location.href = '/dashboard'
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
              <svg xmlns="http://www.w3.org/2000/svg" height="30" width="33.5" viewBox="0 0 448 512">=<path fill="#000000" d="M248 106.6c18.9-9 32-28.3 32-50.6c0-30.9-25.1-56-56-56s-56 25.1-56 56c0 22.3 13.1 41.6 32 50.6l0 98.8c-2.8 1.3-5.5 2.9-8 4.7l-80.1-45.8c1.6-20.8-8.6-41.6-27.9-52.8C57.2 96 23 105.2 7.5 132S1.2 193 28 208.5c1.3 .8 2.6 1.5 4 2.1l0 90.8c-1.3 .6-2.7 1.3-4 2.1C1.2 319-8 353.2 7.5 380S57.2 416 84 400.5c19.3-11.1 29.4-32 27.8-52.8l50.5-28.9c-11.5-11.2-19.9-25.6-23.8-41.7L88 306.1c-2.6-1.8-5.2-3.3-8-4.7l0-90.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-.1 1.4-.2 2.8-.2 4.3c0 22.3 13.1 41.6 32 50.6l0 98.8c-18.9 9-32 28.3-32 50.6c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.3-13.1-41.6-32-50.6l0-98.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-1.6 20.8 8.6 41.6 27.8 52.8c26.8 15.5 61 6.3 76.5-20.5s6.3-61-20.5-76.5c-1.3-.8-2.7-1.5-4-2.1l0-90.8c1.4-.6 2.7-1.3 4-2.1c26.8-15.5 36-49.7 20.5-76.5S390.8 96 364 111.5c-19.3 11.1-29.4 32-27.8 52.8l-50.6 28.9c11.5 11.2 19.9 25.6 23.8 41.7L360 205.9c2.6 1.8 5.2 3.3 8 4.7l0 90.8c-2.8 1.3-5.5 2.9-8 4.6l-80.1-45.8c.1-1.4 .2-2.8 .2-4.3c0-22.3-13.1-41.6-32-50.6l0-98.8z"/>
              </svg>
              <br />
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
