import { NextRequest, NextResponse } from 'next/server'

// Page edit sessions functionality disabled (no authentication)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Page edit sessions disabled - no authentication required'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Page edit sessions disabled - no authentication required'
  })
}