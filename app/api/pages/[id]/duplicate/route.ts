import { query, queryRow } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const pageId = resolvedParams.id
    
    console.log('Duplicating page with ID:', pageId)
    
    // First, fetch the original page
    const originalPage = await queryRow(
      'SELECT * FROM pages WHERE id = $1',
      [pageId]
    )
    
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
      const existingPage = await queryRow(
        'SELECT id FROM pages WHERE slug = $1',
        [newSlug]
      )
      
      if (!existingPage) {
        slugExists = false
      } else {
        counter++
        newSlug = `${originalPage.slug}-copy-${counter}`
      }
    }
    
    // Create the duplicate page
    const newPage = await queryRow(`
      INSERT INTO pages (title, slug, meta_description, meta_keywords, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [
      `${originalPage.title} (Copy)`,
      newSlug,
      originalPage.meta_description,
      originalPage.meta_keywords,
      originalPage.content
    ])
    
    if (!newPage) {
      return NextResponse.json(
        { error: 'Failed to create duplicate page' },
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