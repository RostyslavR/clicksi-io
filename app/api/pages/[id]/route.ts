import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jsonToHtml, htmlToText } from '@/lib/content-converter'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    const pageIdentifier = resolvedParams.id
    
    console.log('Fetching page with identifier:', pageIdentifier)
    
    // Try to fetch by slug first, then by ID if that fails
    let { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', pageIdentifier)
      .single()
    
    // If not found by slug, try by ID
    if (error && error.code === 'PGRST116') {
      ({ data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageIdentifier)
        .single())
    }
    
    if (error) {
      console.error('Database error:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Page not found', identifier: pageIdentifier },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found', identifier: pageIdentifier },
        { status: 404 }
      )
    }

    // Generate HTML and text content from JSON
    let htmlContent = ''
    let textContent = ''
    
    if (page.content && Array.isArray(page.content)) {
      htmlContent = jsonToHtml(page.content)
      textContent = htmlToText(htmlContent)
    }

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        html: htmlContent,
        text: textContent,
        json: page.content || []
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    const pageId = resolvedParams.id
    
    console.log('Deleting page with ID:', pageId)
    
    // First, check if the page exists
    const { data: existingPage, error: fetchError } = await supabase
      .from('pages')
      .select('id, title, slug')
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
    
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Delete the page
    const { error: deleteError } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
    
    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        { error: 'Database error', details: deleteError.message },
        { status: 500 }
      )
    }
    
    console.log('Successfully deleted page:', {
      id: pageId,
      title: existingPage.title,
      slug: existingPage.slug
    })
    
    return NextResponse.json({
      success: true,
      deleted: {
        id: pageId,
        title: existingPage.title,
        slug: existingPage.slug
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}