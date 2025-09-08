import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch user's edit sessions
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
    const sessionId = searchParams.get('sessionId')
    const pageId = searchParams.get('pageId')
    const status = searchParams.get('status')

    let query = supabase
      .from('edit_sessions')
      .select(`
        *,
        edit_content!inner(
          id,
          content_data,
          content_version,
          is_current_version,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    // Apply filters
    if (sessionId) {
      query = query.eq('id', sessionId)
    }
    
    if (pageId) {
      query = query.eq('page_id', pageId)
    }
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error('Error fetching edit sessions:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch edit sessions', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      sessions: sessions || [],
      total: sessions?.length || 0
    })

  } catch (error) {
    console.error('Edit sessions API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error 
    }, { status: 500 })
  }
}

// POST - Create new edit session
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
    const { 
      sessionName, 
      pageId, 
      contentType = 'visual_builder',
      contentData,
      metadata = {}
    } = body

    if (!sessionName) {
      return NextResponse.json({ 
        error: 'Session name is required' 
      }, { status: 400 })
    }

    // Create edit session
    const { data: session, error: sessionError } = await supabase
      .from('edit_sessions')
      .insert({
        user_id: user.id,
        page_id: pageId,
        session_name: sessionName,
        content_type: contentType,
        metadata: metadata
      })
      .select()
      .single()

    if (sessionError) {
      return NextResponse.json({ 
        error: 'Failed to create edit session', 
        details: sessionError 
      }, { status: 500 })
    }

    // If initial content is provided, save it
    if (contentData) {
      const { error: contentError } = await supabase
        .from('edit_content')
        .insert({
          session_id: session.id,
          content_data: contentData,
          created_by: user.id
        })

      if (contentError) {
        console.error('Failed to save initial content:', contentError)
        // Don't fail the session creation, just log the error
      }
    }

    return NextResponse.json({ 
      success: true, 
      session: session,
      message: 'Edit session created successfully' 
    })

  } catch (error) {
    console.error('Create edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to create edit session', 
      details: error 
    }, { status: 500 })
  }
}

// PUT - Update edit session
export async function PUT(request: NextRequest) {
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
    const { sessionId, updates } = body

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Update edit session
    const { data: session, error: updateError } = await supabase
      .from('edit_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ 
        error: 'Failed to update edit session', 
        details: updateError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      session: session,
      message: 'Edit session updated successfully' 
    })

  } catch (error) {
    console.error('Update edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to update edit session', 
      details: error 
    }, { status: 500 })
  }
}

// DELETE - Delete edit session
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
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Delete edit session (cascade will handle related content)
    const { error: deleteError } = await supabase
      .from('edit_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ 
        error: 'Failed to delete edit session', 
        details: deleteError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Edit session deleted successfully' 
    })

  } catch (error) {
    console.error('Delete edit session error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete edit session', 
      details: error 
    }, { status: 500 })
  }
}