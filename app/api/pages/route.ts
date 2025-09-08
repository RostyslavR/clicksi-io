import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jsonToHtml, htmlToText } from '@/lib/content-converter'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const search = url.searchParams.get('search')
    const sortBy = url.searchParams.get('sortBy') || 'updated_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    console.log('Fetching pages with params:', { limit, offset, search, sortBy, sortOrder })
    
    // Build query
    let query = supabase
      .from('pages')
      .select('*', { count: 'exact' })
    
    // Add search filter if provided
    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
    }
    
    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // Add pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: pages, error, count } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
    
    if (!pages) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        }
      })
    }

    // Process pages to generate HTML and text content
    const processedPages = pages.map(page => {
      let htmlContent = ''
      let textContent = ''
      
      if (page.content && Array.isArray(page.content)) {
        // JSON is available - convert to HTML and Text
        htmlContent = jsonToHtml(page.content)
        textContent = htmlToText(htmlContent)
      }
      
      return {
        ...page,
        html: htmlContent,
        text: textContent,
        json: page.content || []
      }
    })

    const hasMore = count ? (offset + limit) < count : false
    
    console.log(`Fetched ${pages.length} pages, total: ${count}`)

    return NextResponse.json({
      success: true,
      data: processedPages,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore
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

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { ids } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Page IDs are required' },
        { status: 400 }
      )
    }
    
    console.log('Deleting pages with IDs:', ids)
    
    const { error } = await supabase
      .from('pages')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
    
    console.log(`Successfully deleted ${ids.length} pages`)
    
    return NextResponse.json({
      success: true,
      deleted: ids.length
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}