import { query, queryRows } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'
import { jsonToHtml, htmlToText } from '@/lib/content-converter'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const search = url.searchParams.get('search')
    const sortBy = url.searchParams.get('sortBy') || 'updated_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    console.log('Fetching pages with params:', { limit, offset, search, sortBy, sortOrder })
    
    // Build base query
    let queryText = 'SELECT * FROM pages'
    let countQueryText = 'SELECT COUNT(*) FROM pages'
    const params: unknown[] = []
    let paramIndex = 1
    
    // Add search filter if provided
    if (search && search.trim()) {
      const searchClause = ' WHERE (title ILIKE $' + paramIndex + ' OR slug ILIKE $' + (paramIndex + 1) + ')'
      queryText += searchClause
      countQueryText += searchClause
      params.push(`%${search}%`, `%${search}%`)
      paramIndex += 2
    }
    
    // Add sorting
    const validSortColumns = ['title', 'slug', 'created_at', 'updated_at']
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'updated_at'
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'
    queryText += ` ORDER BY ${safeSortBy} ${safeSortOrder}`
    
    // Add pagination
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)
    
    // Execute queries
    const [pagesResult, countResult] = await Promise.all([
      queryRows(queryText, params),
      query(countQueryText, search && search.trim() ? [`%${search}%`, `%${search}%`] : [])
    ])
    
    const pages = pagesResult
    const count = parseInt(countResult.rows[0]?.count || '0')
    
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
    const { ids } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Page IDs are required' },
        { status: 400 }
      )
    }
    
    console.log('Deleting pages with IDs:', ids)
    
    // Create placeholders for the IN clause
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',')
    const deleteQuery = `DELETE FROM pages WHERE id IN (${placeholders})`
    
    const result = await query(deleteQuery, ids)
    
    console.log(`Successfully deleted ${result.rowCount} pages`)
    
    return NextResponse.json({
      success: true,
      deleted: result.rowCount
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}