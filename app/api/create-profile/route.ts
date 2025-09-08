import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated', 
        details: userError 
      }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { full_name, role = 'user' } = body

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({ 
        success: true, 
        message: 'Profile already exists',
        profile: existingProfile 
      })
    }

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: full_name || user.user_metadata?.full_name || null,
        role: role
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ 
        error: 'Failed to create profile', 
        details: createError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile created successfully',
      profile: newProfile 
    })

  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ 
      error: 'Profile creation failed', 
      details: error 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated'
      }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ 
        error: 'Profile not found', 
        details: profileError,
        user: { id: user.id, email: user.email }
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile: profile 
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to get profile', 
      details: error 
    }, { status: 500 })
  }
}