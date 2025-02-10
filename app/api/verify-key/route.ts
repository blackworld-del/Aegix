import { NextResponse } from 'next/server'
import SecurityStore from '@/lib/security-store'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const ATTEMPT_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds

function getClientIp(request: Request): string {
  // Get X-Forwarded-For header which contains the client's original IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Get the first IP in the list (original client IP)
    return forwardedFor.split(',')[0].trim()
  }
  
  // Try CF-Connecting-IP (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }

  // Try True-Client-IP (Akamai and others)
  const trueClientIp = request.headers.get('true-client-ip')
  if (trueClientIp) {
    return trueClientIp
  }

  // Try X-Real-IP (NGINX)
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to URL hostname if no headers available
  const url = new URL(request.url)
  return url.hostname || 'localhost'
}

function isLocked(record: ReturnType<typeof SecurityStore.getAttemptRecord>): boolean {
  if (!record.locked) return false
  if (Date.now() > record.lockExpiry) {
    record.locked = false
    record.count = 0
    return false
  }
  return true
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const now = Date.now()
    
    // Log security event
    console.log(`[Security] Verification attempt from IP: ${clientIp}`)
    
    // Get attempt record from store
    let record = SecurityStore.getAttemptRecord(clientIp)

    // Check if locked
    if (isLocked(record)) {
      const remainingTime = Math.ceil((record.lockExpiry - now) / 1000 / 60)
      console.log(`[Security] IP ${clientIp} is locked out for ${remainingTime} minutes`)
      return NextResponse.json({
        success: false,
        error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`
      }, { status: 429 })
    }

    // Reset count if outside attempt window
    if (now - record.lastAttempt > ATTEMPT_WINDOW) {
      record.count = 0
    }

    const { key } = await request.json()
    const storedKey = process.env.SECURITY_KEY

    if (!storedKey) {
      console.log(`[Security] Error: Security key not configured`)
      return NextResponse.json({ success: false, error: 'Security key not configured' }, { status: 500 })
    }

    // Verify key
    const isValid = key === storedKey

    if (!isValid) {
      record.count++
      record.lastAttempt = now

      // Check if should lock
      if (record.count >= MAX_ATTEMPTS) {
        record.locked = true
        record.lockExpiry = now + LOCKOUT_DURATION
        SecurityStore.setAttemptRecord(clientIp, record)
        console.log(`[Security] IP ${clientIp} has been locked out due to too many failed attempts`)
        return NextResponse.json({
          success: false,
          error: 'Too many failed attempts. Please try again in 15 minutes.'
        }, { status: 429 })
      }

      SecurityStore.setAttemptRecord(clientIp, record)
      const remainingAttempts = MAX_ATTEMPTS - record.count
      console.log(`[Security] Failed attempt from IP ${clientIp}. ${remainingAttempts} attempts remaining`)
      return NextResponse.json({
        success: false,
        error: `Invalid key. ${remainingAttempts} attempts remaining.`
      })
    }

    // Success - clear attempt record and set verification cookie
    SecurityStore.clearAttemptRecord(clientIp)
    console.log(`[Security] Successful verification from IP: ${clientIp}`)
    
    const response = NextResponse.json({ success: true })
    
    // Set secure HTTP-only cookie that expires in 24 hours
    response.cookies.set('securityVerified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response

  } catch (error) {
    console.error(`[Security] Error verifying key:`, error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
