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
    
    // Prepare content data with validation
    let contentData;
    try {
      if (typeof originalPage.content === 'string') {
        // If it's a string, validate it's proper JSON
        JSON.parse(originalPage.content);
        contentData = originalPage.content;
      } else if (originalPage.content) {
        // If it's an object/array, stringify it
        contentData = JSON.stringify(originalPage.content);
      } else {
        // Default to empty array
        contentData = JSON.stringify([]);
      }
    } catch (error) {
      console.error('Invalid JSON in content:', error);
      // Fallback to empty array if JSON is malformed
      contentData = JSON.stringify([]);
    }

    // Create the duplicate page - handle different data types properly
    const newPage = await queryRow(`
      INSERT INTO pages (title, slug, meta_description, meta_keywords, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, NOW(), NOW())
      RETURNING *
    `, [
      `${originalPage.title} (Copy)`,
      newSlug,
      originalPage.meta_description,
      originalPage.meta_keywords, // Keep as array for text[] column
      contentData
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