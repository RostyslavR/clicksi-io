import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Get the client IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  let ip = forwarded?.split(',')[0] || realIP || 'unknown'
  
  // Handle localhost
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = 'localhost'
  }
  
  return NextResponse.json({ ip })
}