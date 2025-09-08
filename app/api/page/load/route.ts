import { NextRequest, NextResponse } from 'next/server'
import { htmlToText, htmlToJson } from '@/lib/content-converter'

export async function POST(request: NextRequest) {
  try {
    const { 
      url, 
      removeHeader = true, 
      removeFooter = true, 
      removeNavigation = true, 
      removeSidebar = true 
    } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate that it's a full URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Please provide a full URL starting with http:// or https://' },
        { status: 400 }
      )
    }

    console.log('Fetching content from external URL:', url)

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    
    // Check if this is a client-side rendered page (SPA)
    const isClientRendered = html.includes('Loading...') || 
                            html.includes('animate-spin') || 
                            html.includes('loading') ||
                            (html.includes('<div') && html.length < 1000 && !html.includes('<p')) ||
                            html.includes('id="root"') ||
                            html.includes('id="__next"')
    
    if (isClientRendered) {
      return NextResponse.json({
        error: 'This appears to be a client-side rendered application (SPA). The server can only fetch the initial loading state, not the actual content. Please use a tool like Puppeteer or visit the page directly in a browser to get the rendered content.',
        isClientRendered: true,
        fetchedContent: html.substring(0, 500) + '...'
      }, { status: 422 })
    }
    
    // Extract metadata from HTML
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Page'
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i)
    const description = descMatch ? descMatch[1] : ''
    
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["'](.*?)["'][^>]*>/i)
    const keywords = keywordsMatch ? keywordsMatch[1] : ''
    
    // Extract content - take everything from body and clean it up
    let content = html
    
    // Get body content (ES5 compatible regex)
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1]
    }
    
    // Remove unwanted elements but keep the main content structure
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    
    // Apply conditional filtering based on options
    if (removeHeader) {
      content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    }
    
    if (removeFooter) {
      content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    }
    
    if (removeNavigation) {
      content = content
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<div[^>]*class=["'][^"']*nav[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/<div[^>]*class=["'][^"']*navigation[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    }
    
    if (removeSidebar) {
      content = content
        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
        .replace(/<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/<div[^>]*class=["'][^"']*side-bar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    }
    
    content = content.trim()
      
    console.log('Content after filtering:', {
      length: content.length,
      preview: content.substring(0, 500) + '...',
      filters: { removeHeader, removeFooter, removeNavigation, removeSidebar }
    })

    // Convert to different formats
    const textContent = htmlToText(content)
    const jsonContent = htmlToJson(content)
    
    // Generate slug from URL or title
    let slug = url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '').replace(/\/$/, '')
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    console.log('Content extraction results:', {
      title,
      contentLength: content.length,
      textLength: textContent.length,
      jsonLength: JSON.stringify(jsonContent).length,
      contentPreview: content.substring(0, 200) + '...'
    })

    return NextResponse.json({
      success: true,
      htmlContent: content,
      textContent: textContent,
      jsonContent: jsonContent,
      title: title,
      description: description,
      keywords: keywords,
      url: url,
      slug: slug
    })

  } catch (error) {
    console.error('Error fetching URL content:', error)
    // Handle unknown error type properly
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to fetch content: ${errorMessage}` },
      { status: 500 }
    )
  }
}