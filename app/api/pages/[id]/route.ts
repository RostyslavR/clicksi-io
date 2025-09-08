import { query, queryRow } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'
import { jsonToHtml, htmlToText } from '@/lib/content-converter'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const pageIdentifier = resolvedParams.id
    
    console.log('Fetching page with identifier:', pageIdentifier)
    
    // Try to fetch by slug first, then by ID if that fails
    let page = await queryRow(
      'SELECT * FROM pages WHERE slug = $1',
      [pageIdentifier]
    )
    
    // If not found by slug, try by ID
    if (!page) {
      page = await queryRow(
        'SELECT * FROM pages WHERE id = $1',
        [pageIdentifier]
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
    const resolvedParams = await params
    const pageId = resolvedParams.id
    
    console.log('Deleting page with ID:', pageId)
    
    // First, check if the page exists
    const existingPage = await queryRow(
      'SELECT id, title, slug FROM pages WHERE id = $1',
      [pageId]
    )
    
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Delete the page
    const result = await query(
      'DELETE FROM pages WHERE id = $1',
      [pageId]
    )
    
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