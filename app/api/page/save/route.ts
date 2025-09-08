import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

    const supabase = await createClient()
    
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

    // First, try to update existing page by slug
    const { data: existingPage } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single()

    let result;
    
    if (existingPage) {
      // Update existing page
      result = await supabase
        .from('pages')
        .update({
          title,
          content: finalJsonContent,
          meta_description: description,
          meta_keywords: keywords ? keywords.split(',').map(function(keyword: string) { return keyword.trim(); }) : [],
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select()
        .single()
    } else {
      // Insert new page with proper field names
      result = await supabase
        .from('pages')
        .insert({
          title,
          slug,
          content: finalJsonContent,
          meta_description: description,
          meta_keywords: keywords ? keywords.split(',').map(function(keyword: string) { return keyword.trim(); }) : []
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Database save error:', result.error)
      return NextResponse.json(
        { error: 'Failed to save page to database', details: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Page saved successfully to database',
      data: result.data
    });

  } catch (error) {
    console.error('Error in page save API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}