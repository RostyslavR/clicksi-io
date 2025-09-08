import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch content for a session
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
    const version = searchParams.get('version')
    const currentOnly = searchParams.get('currentOnly') === 'true'

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

    let query = supabase
      .from('edit_content')
      .select('*')
      .eq('session_id', sessionId)

    if (currentOnly) {
      query = query.eq('is_current_version', true)
    } else if (version) {
      query = query.eq('content_version', parseInt(version))
    }

    query = query.order('content_version', { ascending: false })

    const { data: content, error } = await query

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch content', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      content: content || [],
      currentContent: currentOnly ? (content?.[0] || null) : null
    })

  } catch (error) {
    console.error('Fetch content error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content', 
      details: error 
    }, { status: 500 })
  }
}

// POST - Save new content version
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
    const { sessionId, contentData, isAutoSave = false } = body

    if (!sessionId || !contentData) {
      return NextResponse.json({ 
        error: 'Session ID and content data are required' 
      }, { status: 400 })
    }

    // Verify user owns the session
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

    if (isAutoSave) {
      // Handle auto-save
      if (!session.auto_save_enabled) {
        return NextResponse.json({ 
          success: true, 
          message: 'Auto-save disabled for this session' 
        })
      }

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
          error: 'Failed to auto-save content', 
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
        message: 'Content auto-saved successfully' 
      })
    } else {
      // Handle manual save - create new version
      // Get next version number
      const { data: latestContent } = await supabase
        .from('edit_content')
        .select('content_version')
        .eq('session_id', sessionId)
        .order('content_version', { ascending: false })
        .limit(1)
        .single()

      const nextVersion = (latestContent?.content_version || 0) + 1

      const { data: newContent, error: contentError } = await supabase
        .from('edit_content')
        .insert({
          session_id: sessionId,
          content_data: contentData,
          content_version: nextVersion,
          created_by: user.id
        })
        .select()
        .single()

      if (contentError) {
        return NextResponse.json({ 
          error: 'Failed to save content', 
          details: contentError 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        content: newContent,
        message: `Content saved as version ${nextVersion}` 
      })
    }

  } catch (error) {
    console.error('Save content error:', error)
    return NextResponse.json({ 
      error: 'Failed to save content', 
      details: error 
    }, { status: 500 })
  }
}

// PUT - Update existing content version
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
    const { contentId, contentData, makeCurrentVersion = false } = body

    if (!contentId || !contentData) {
      return NextResponse.json({ 
        error: 'Content ID and content data are required' 
      }, { status: 400 })
    }

    // Verify user owns the content
    const { data: content } = await supabase
      .from('edit_content')
      .select(`
        *,
        edit_sessions!inner(user_id)
      `)
      .eq('id', contentId)
      .single()

    if (!content || content.edit_sessions.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Content not found or access denied' 
      }, { status: 404 })
    }

    const updates: { content_data: unknown; is_current_version?: boolean } = { content_data: contentData }
    if (makeCurrentVersion) {
      updates.is_current_version = true
    }

    const { data: updatedContent, error: updateError } = await supabase
      .from('edit_content')
      .update(updates)
      .eq('id', contentId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ 
        error: 'Failed to update content', 
        details: updateError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      content: updatedContent,
      message: 'Content updated successfully' 
    })

  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json({ 
      error: 'Failed to update content', 
      details: error 
    }, { status: 500 })
  }
}