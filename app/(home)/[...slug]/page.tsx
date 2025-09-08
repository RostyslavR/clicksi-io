'use client'

import { Navigation } from '@/components/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface PageData {
  id: string
  title: string
  slug: string
  description?: string
  keywords?: string
  content?: unknown
  html?: string // Generated from content JSON
  text?: string // Generated from content JSON
  created_at: string
  updated_at: string
}

export default function DynamicDatabasePage() {
  const params = useParams()
  const slug = params.slug as string[]
  
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Construct the slug from slug array
        const pageSlug = slug.join('/')
        
        console.log('Loading page for slug:', pageSlug)
        
        // Fetch page data from our API
        const response = await fetch(`/api/pages/${slug.join('/')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setPageData(result.data)
          } else {
            setError('Page not found in database')
          }
        } else if (response.status === 404) {
          setError('Page not found')
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || 'Failed to load page')
        }
      } catch (err) {
        console.error('Error loading page:', err)
        setError('Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    if (slug && slug.length > 0) {
      loadPageData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="bg-[#171717] py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-[#828288] text-lg mb-4">Loading page...</div>
            <div className="w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="bg-[#171717] py-16 flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-xl font-semibold mb-4">Page Not Found</div>
            <div className="text-[#828288] mb-6">{error}</div>
            <div>
              <Link 
                href="/" 
                className="inline-block bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="bg-[#171717] py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[#828288]">No page data available</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="bg-[#171717] py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb/Navigation */}
          <div className="mb-8">
            <Link href="/" className="flex items-center text-[#828288] hover:text-[#EDECF8] transition-colors text-sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>


          {/* Page Content */}
          <article className="prose prose-invert prose-lg max-w-none 
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:text-[#EDECF8]
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-[#EDECF8]
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:text-[#EDECF8]
            prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[#EDECF8]
            prose-ul:mb-6 prose-ul:space-y-2
            prose-li:text-[#EDECF8]
            prose-a:text-[#D78E59] prose-a:no-underline hover:prose-a:text-[#FFAA6C]
            prose-strong:text-[#EDECF8]
            prose-code:text-[#D78E59] prose-code:bg-[#090909] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#090909] prose-pre:border prose-pre:border-[#202020]
            prose-blockquote:border-l-[#D78E59] prose-blockquote:text-[#828288]
          ">
            {pageData.content && Array.isArray(pageData.content) && pageData.content.length > 0 ? (
              <div className="dynamic-page-content">
                {/* Render JSON content as HTML - this will be generated by the API */}
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: pageData.html || 'Content will be generated from JSON structure' 
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-[#090909]/30 border border-[#202020] rounded-xl">
                <p className="text-[#828288]">
                  This page exists but has no content yet.
                </p>
              </div>
            )}
          </article>

          {/* Page Footer/Meta */}
          {pageData.keywords && (
            <footer className="mt-12 pt-8 border-t border-[#202020]">
              <div className="flex flex-wrap gap-2">
                <span className="text-[#828288] text-sm mr-2">Tags:</span>
                {pageData.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-[#202020] text-[#828288] px-2 py-1 rounded text-xs"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}