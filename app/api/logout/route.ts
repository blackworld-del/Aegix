import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = cookies()
  
  // Remove the verification cookie
  cookieStore.delete('securityVerified')
  
  return NextResponse.json({ success: true })
}
