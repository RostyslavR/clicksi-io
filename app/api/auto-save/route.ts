import { NextRequest, NextResponse } from 'next/server'

// Auto-save functionality disabled (no authentication)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Auto-save disabled - no authentication required'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Auto-save disabled - no authentication required'
  })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Auto-save disabled - no authentication required'
  })
}