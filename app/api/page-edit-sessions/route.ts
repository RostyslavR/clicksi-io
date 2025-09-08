import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch current page edit session
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get('pageSlug')

    if (!pageSlug) {
      return NextResponse.json({ 
        error: 'Page slug is required' 
      }, { status: 400 })
    }

    // Get active edit session for this page
    const { data: session, error } = await supabase
      .from('page_edit_sessions')
      .select('*')
      .eq('page_slug', pageSlug)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      // Check if it's a table not found error (expected during setup)
      if (error.message?.includes('relation "public.page_edit_sessions" does not exist') || 
          error.code === '42P01') {
        console.log('Page edit sessions table does not exist yet - returning empty session')
        return NextResponse.json({ 
          success: true, 
          session: null,
          hasActiveSession: false,
          table_missing: true
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch edit session', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      session: session || null,
      hasActiveSession: !!session
    })

  } catch (error) {
    console.error('Fetch page edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch page edit session', 
      details: error 
    }, { status: 500 })
  }
}

// POST - Save current page edit data
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { pageSlug, pageUrl, editData } = body

    if (!pageSlug || !pageUrl || !editData) {
      return NextResponse.json({ 
        error: 'Page slug, URL and edit data are required' 
      }, { status: 400 })
    }

    // First, deactivate any existing sessions for this page/user
    await supabase
      .from('page_edit_sessions')
      .update({ is_active: false })
      .eq('page_slug', pageSlug)
      .eq('user_id', user.id)

    // Create new active session
    const { data: session, error: insertError } = await supabase
      .from('page_edit_sessions')
      .insert({
        page_slug: pageSlug,
        page_url: pageUrl,
        edit_data: editData,
        user_id: user.id,
        is_active: true
      })
      .select()
      .single()

    if (insertError) {
      // Check if it's a table not found error (expected during setup)
      if (insertError.message?.includes('relation "public.page_edit_sessions" does not exist') || 
          insertError.code === 'PGRST116' || insertError.code === '42P01') {
        // Return success but indicate table doesn't exist yet
        console.log('Page edit sessions table does not exist yet - silently handling')
        return NextResponse.json({ 
          success: true, 
          message: 'Edit data not saved - database table pending migration',
          table_missing: true
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to save edit session', 
        details: insertError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      session: session,
      message: 'Edit data saved successfully' 
    })

  } catch (error) {
    console.error('Save page edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to save page edit session', 
      details: error 
    }, { status: 500 })
  }
}

// DELETE - Clear current page edit session
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get('pageSlug')

    if (!pageSlug) {
      return NextResponse.json({ 
        error: 'Page slug is required' 
      }, { status: 400 })
    }

    // Deactivate all sessions for this page/user
    const { error: updateError } = await supabase
      .from('page_edit_sessions')
      .update({ is_active: false })
      .eq('page_slug', pageSlug)
      .eq('user_id', user.id)

    if (updateError) {
      // Check if it's a table not found error (expected during setup)
      if (updateError.message?.includes('relation "public.page_edit_sessions" does not exist') || 
          updateError.code === '42P01') {
        console.log('Page edit sessions table does not exist yet - silently handling clear')
        return NextResponse.json({ 
          success: true, 
          message: 'Edit session cleared (table pending migration)',
          table_missing: true
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to clear edit session', 
        details: updateError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Edit session cleared successfully' 
    })

  } catch (error) {
    console.error('Clear page edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear page edit session', 
      details: error 
    }, { status: 500 })
  }
}