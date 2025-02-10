import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  // Check for verification cookie
  const cookieStore = cookies()
  const isVerified = cookieStore.get('securityVerified')?.value === 'true'
  return NextResponse.json({ isVerified })
}
