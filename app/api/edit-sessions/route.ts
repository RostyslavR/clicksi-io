import { NextRequest, NextResponse } from 'next/server'

// Edit sessions functionality disabled (no authentication)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Edit sessions disabled - no authentication required'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Edit sessions disabled - no authentication required'
  })
}