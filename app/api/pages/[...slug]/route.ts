import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jsonToHtml, htmlToText } from '@/lib/content-converter'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    
    // Get the slug from the URL path
    const slug = resolvedParams.slug.join('/')
    
    console.log('Fetching page for slug:', slug)
    
    // Query the pages table by slug field
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Page not found', slug },
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
        { error: 'Page not found', slug },
        { status: 404 }
      )
    }

    // Generate HTML and text content from JSON
    let htmlContent = ''
    let textContent = ''
    
    if (page.content && Array.isArray(page.content)) {
      // JSON is available - convert to HTML and Text
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