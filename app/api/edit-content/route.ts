import { NextRequest, NextResponse } from 'next/server'

// Edit content functionality disabled (no authentication)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Edit content disabled - no authentication required'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Edit content disabled - no authentication required'
  })
}