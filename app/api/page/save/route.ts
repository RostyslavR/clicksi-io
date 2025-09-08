import { NextRequest, NextResponse } from 'next/server'
import { query, queryRow } from '@/lib/database'
import { htmlToJson } from '@/lib/content-converter'

export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      slug, 
      description,
      keywords, 
      htmlContent,
      jsonContent 
    } = await request.json();

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required fields' },
        { status: 400 }
      );
    }

    // Only store JSON content - HTML and text will be generated from JSON when needed
    let finalJsonContent = jsonContent || []

    // If HTML is provided but JSON is missing, generate JSON from HTML
    if (htmlContent && (!jsonContent || jsonContent.length === 0)) {
      finalJsonContent = htmlToJson(htmlContent)
    }
    
    console.log('Saving page to database:', {
      title,
      slug,
      description: description?.substring(0, 100) + '...',
      keywords,
      contentLength: {
        json: Array.isArray(finalJsonContent) ? finalJsonContent.length : (typeof finalJsonContent === 'string' ? finalJsonContent.length : 0)
      }
    });

    // First, try to find existing page by slug
    const existingPage = await queryRow(
      'SELECT id FROM pages WHERE slug = $1',
      [slug]
    )

    let result;
    const keywordArray = keywords ? keywords.split(',').map((keyword: string) => keyword.trim()) : []
    
    if (existingPage) {
      // Update existing page
      result = await queryRow(`
        UPDATE pages 
        SET title = $1, content = $2::jsonb, meta_description = $3, meta_keywords = $4, updated_at = NOW()
        WHERE slug = $5
        RETURNING *
      `, [title, JSON.stringify(finalJsonContent), description, keywordArray, slug])
    } else {
      // Insert new page
      result = await queryRow(`
        INSERT INTO pages (title, slug, content, meta_description, meta_keywords, created_at, updated_at)
        VALUES ($1, $2, $3::jsonb, $4, $5, NOW(), NOW())
        RETURNING *
      `, [title, slug, JSON.stringify(finalJsonContent), description, keywordArray])
    }

    if (!result) {
      console.error('Database save error: No result returned')
      return NextResponse.json(
        { error: 'Failed to save page to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Page saved successfully to database',
      data: result
    });

  } catch (error) {
    console.error('Error in page save API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}