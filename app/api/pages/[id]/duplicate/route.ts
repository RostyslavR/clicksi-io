import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    const pageId = resolvedParams.id
    
    console.log('Duplicating page with ID:', pageId)
    // Fixed column names: meta_description and meta_keywords
    
    // First, fetch the original page
    const { data: originalPage, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()
    
    if (fetchError) {
      console.error('Database error:', fetchError)
      
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database error', details: fetchError.message },
        { status: 500 }
      )
    }
    
    if (!originalPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Create a new slug by appending a suffix
    let newSlug = `${originalPage.slug}-copy`
    let counter = 1
    
    // Check if slug exists and increment counter until we find a unique one
    let slugExists = true
    while (slugExists) {
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', newSlug)
        .single()
      
      if (!existingPage) {
        slugExists = false
      } else {
        counter++
        newSlug = `${originalPage.slug}-copy-${counter}`
      }
    }
    
    // Create the duplicate page (only using existing database columns)
    const duplicatePage = {
      title: `${originalPage.title} (Copy)`,
      slug: newSlug,
      meta_description: originalPage.meta_description,
      meta_keywords: originalPage.meta_keywords,
      content: originalPage.content
    }
    
    const { data: newPage, error: insertError } = await supabase
      .from('pages')
      .insert([duplicatePage])
      .select()
      .single()
    
    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { error: 'Database error', details: insertError.message },
        { status: 500 }
      )
    }
    
    console.log('Successfully duplicated page:', {
      originalId: pageId,
      newId: newPage.id,
      newSlug: newSlug
    })
    
    return NextResponse.json({
      success: true,
      data: newPage
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}