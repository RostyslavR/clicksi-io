import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch auto-saves for a session
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
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Verify user owns the session
    const { data: session } = await supabase
      .from('edit_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Session not found or access denied' 
      }, { status: 404 })
    }

    const { data: autoSaves, error } = await supabase
      .from('edit_auto_saves')
      .select('*')
      .eq('session_id', sessionId)
      .order('auto_save_timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch auto-saves', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      autoSaves: autoSaves || [],
      total: autoSaves?.length || 0
    })

  } catch (error) {
    console.error('Fetch auto-saves error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch auto-saves', 
      details: error 
    }, { status: 500 })
  }
}

// POST - Create auto-save
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
    const { sessionId, contentData } = body

    if (!sessionId || !contentData) {
      return NextResponse.json({ 
        error: 'Session ID and content data are required' 
      }, { status: 400 })
    }

    // Verify user owns the session and auto-save is enabled
    const { data: session } = await supabase
      .from('edit_sessions')
      .select('user_id, auto_save_enabled')
      .eq('id', sessionId)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Session not found or access denied' 
      }, { status: 404 })
    }

    if (!session.auto_save_enabled) {
      return NextResponse.json({ 
        success: false,
        message: 'Auto-save is disabled for this session' 
      })
    }

    // Create auto-save
    const { data: autoSave, error: autoSaveError } = await supabase
      .from('edit_auto_saves')
      .insert({
        session_id: sessionId,
        content_data: contentData,
        user_id: user.id
      })
      .select()
      .single()

    if (autoSaveError) {
      return NextResponse.json({ 
        error: 'Failed to create auto-save', 
        details: autoSaveError 
      }, { status: 500 })
    }

    // Update session's last auto-save timestamp
    await supabase
      .from('edit_sessions')
      .update({ last_auto_save: new Date().toISOString() })
      .eq('id', sessionId)

    return NextResponse.json({ 
      success: true, 
      autoSave: autoSave,
      message: 'Auto-save created successfully' 
    })

  } catch (error) {
    console.error('Create auto-save error:', error)
    return NextResponse.json({ 
      error: 'Failed to create auto-save', 
      details: error 
    }, { status: 500 })
  }
}

// DELETE - Clean up old auto-saves
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
    const autoSaveId = searchParams.get('autoSaveId')
    const olderThan = searchParams.get('olderThan') // ISO date string

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Verify user owns the session
    const { data: session } = await supabase
      .from('edit_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Session not found or access denied' 
      }, { status: 404 })
    }

    let deleteQuery = supabase
      .from('edit_auto_saves')
      .delete()
      .eq('session_id', sessionId)

    if (autoSaveId) {
      // Delete specific auto-save
      deleteQuery = deleteQuery.eq('id', autoSaveId)
    } else if (olderThan) {
      // Delete auto-saves older than specified date
      deleteQuery = deleteQuery.lt('auto_save_timestamp', olderThan)
    } else {
      return NextResponse.json({ 
        error: 'Must specify either autoSaveId or olderThan parameter' 
      }, { status: 400 })
    }

    const { error: deleteError } = await deleteQuery

    if (deleteError) {
      return NextResponse.json({ 
        error: 'Failed to delete auto-saves', 
        details: deleteError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Auto-saves deleted successfully' 
    })

  } catch (error) {
    console.error('Delete auto-saves error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete auto-saves', 
      details: error 
    }, { status: 500 })
  }
}