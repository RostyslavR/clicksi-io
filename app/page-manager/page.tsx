'use client'

import { Navigation } from '@/components/navigation'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/contexts/LanguageContext'
import { jsonToHtml, htmlToText, ContentNode } from '@/lib/content-converter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useConfirm } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toast'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  Calendar,
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface PageData {
  id: string
  title: string
  slug: string
  description?: string
  keywords?: string
  content?: ContentNode[]
  html?: string
  text?: string
  created_at: string
  updated_at: string
}

export default function PageManager() {
  const { t } = useTranslation()
  const { confirm, ConfirmDialog } = useConfirm()
  const { addToast } = useToast()
  const [pages, setPages] = useState<PageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/pages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPages(result.data || [])
        } else {
          setError('Failed to load pages')
        }
      } else {
        setError('Failed to load pages')
      }
    } catch (err) {
      console.error('Error loading pages:', err)
      setError('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const togglePageSelection = (pageId: string) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId)
    } else {
      newSelected.add(pageId)
    }
    setSelectedPages(newSelected)
  }

  const selectAllPages = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set())
    } else {
      setSelectedPages(new Set(filteredPages.map(page => page.id)))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getContentStats = (page: PageData) => {
    let wordCount = 0
    
    // Try to get word count from text field first (from API)
    if (page.text && page.text.trim()) {
      wordCount = page.text.trim().split(/\s+/).length
    }
    // If no text field, use the same method as API routes: jsonToHtml → htmlToText
    else if (page.content && Array.isArray(page.content)) {
      try {
        const htmlContent = jsonToHtml(page.content)
        const textContent = htmlToText(htmlContent)
        if (textContent && textContent.trim()) {
          wordCount = textContent.trim().split(/\s+/).length
        }
      } catch (error) {
        console.warn('Error converting content for word count:', error)
        wordCount = 0
      }
    }
    
    const hasContent = page.content && Array.isArray(page.content) && page.content.length > 0
    return { wordCount, hasContent }
  }

  const deletePage = async (pageId: string) => {
    const confirmed = await confirm({
      title: 'Delete Page',
      description: 'Are you sure you want to delete this page? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'destructive'
    })

    if (!confirmed) return

    try {
      setActionLoading(`delete-${pageId}`)
      
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setPages(pages.filter(page => page.id !== pageId))
        setSelectedPages(prev => {
          const newSelected = new Set(prev)
          newSelected.delete(pageId)
          return newSelected
        })
        addToast({
          type: 'success',
          title: 'Page deleted',
          description: 'The page has been successfully deleted.'
        })
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to delete page'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Delete failed',
          description: errorMessage
        })
      }
    } catch (err) {
      console.error('Error deleting page:', err)
      const errorMessage = 'Failed to delete page'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Delete failed',
        description: errorMessage
      })
    } finally {
      setActionLoading(null)
    }
  }

  const duplicatePage = async (pageId: string) => {
    try {
      setActionLoading(`duplicate-${pageId}`)
      
      const response = await fetch(`/api/pages/${pageId}/duplicate`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Add the new page to the beginning of the list
          setPages([result.data, ...pages])
          addToast({
            type: 'success',
            title: 'Page duplicated',
            description: 'The page has been successfully duplicated.'
          })
        }
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to duplicate page'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Duplicate failed',
          description: errorMessage
        })
      }
    } catch (err) {
      console.error('Error duplicating page:', err)
      const errorMessage = 'Failed to duplicate page'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Duplicate failed',
        description: errorMessage
      })
    } finally {
      setActionLoading(null)
    }
  }

  const deleteSelectedPages = async () => {
    if (selectedPages.size === 0) return
    
    const pageCount = selectedPages.size
    const confirmed = await confirm({
      title: `Delete ${pageCount} Page${pageCount > 1 ? 's' : ''}`,
      description: `Are you sure you want to delete ${pageCount} page${pageCount > 1 ? 's' : ''}? This action cannot be undone.`,
      confirmText: 'Delete All',
      variant: 'destructive'
    })

    if (!confirmed) return

    try {
      setActionLoading('bulk-delete')
      
      const response = await fetch('/api/pages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: Array.from(selectedPages) })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPages(pages.filter(page => !selectedPages.has(page.id)))
          setSelectedPages(new Set())
          addToast({
            type: 'success',
            title: `${pageCount} page${pageCount > 1 ? 's' : ''} deleted`,
            description: 'The selected pages have been successfully deleted.'
          })
        }
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to delete pages'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Bulk delete failed',
          description: errorMessage
        })
      }
    } catch (err) {
      console.error('Error deleting pages:', err)
      const errorMessage = 'Failed to delete pages'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Bulk delete failed',
        description: errorMessage
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="bg-[#171717] py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-[#828288] text-lg mb-4">Loading pages...</div>
            <div className="w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="bg-[#171717] py-8 md:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#EDECF8] mb-2">
                  Page Manager
                </h1>
                <p className="text-[#828288]">
                  Manage all your website pages in one place
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={loadPages}
                  variant="outline"
                  className="border-[#202020] text-[#828288] hover:text-[#EDECF8] hover:border-[#D78E59]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t.navigation.refresh}
                </Button>
                
                <Link href="/page-editor">
                  <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.navigation.create} Page
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Stats */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#090909] border-[#202020] text-[#EDECF8] placeholder-[#828288] focus:border-[#D78E59]"
                />
              </div>
              
              <div className="text-[#828288] text-sm">
                {filteredPages.length} of {pages.length} pages
                {selectedPages.size > 0 && (
                  <span className="ml-2 text-[#D78E59]">
                    ({selectedPages.size} selected)
                  </span>
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedPages.size > 0 && (
              <div className="mb-6 p-4 bg-[#090909] border border-[#202020] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-[#EDECF8] font-medium">
                    {selectedPages.size} pages selected
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={deleteSelectedPages}
                      disabled={actionLoading === 'bulk-delete'}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {actionLoading === 'bulk-delete' ? `${t.navigation.delete}...` : `${t.navigation.delete} Selected`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 bg-red-900/20 border-red-600">
              <CardContent className="pt-6">
                <div className="text-red-400">{error}</div>
              </CardContent>
            </Card>
          )}

          {/* Pages List */}
          {filteredPages.length === 0 && !loading ? (
            <Card className="bg-[#090909] border-[#202020]">
              <CardContent className="pt-6 text-center py-12">
                <FileText className="w-12 h-12 text-[#828288] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">
                  {searchTerm ? 'No pages found' : 'No pages created yet'}
                </h3>
                <p className="text-[#828288] mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first page to get started'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/page-editor">
                    <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Page
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-3 p-3 bg-[#090909] border border-[#202020] rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedPages.size === filteredPages.length && filteredPages.length > 0}
                  onChange={selectAllPages}
                  className="rounded border-[#202020] text-[#D78E59] focus:ring-[#D78E59] focus:ring-offset-0"
                />
                <span className="text-[#828288] text-sm font-medium">
                  Select All ({filteredPages.length})
                </span>
              </div>

              {/* Pages Grid */}
              <div className="grid gap-4">
                {filteredPages.map((page) => {
                  const { wordCount, hasContent } = getContentStats(page)
                  const isSelected = selectedPages.has(page.id)
                  
                  return (
                    <Card 
                      key={page.id} 
                      className={`bg-[#090909] border transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#D78E59] ring-1 ring-[#D78E59]/20' 
                          : 'border-[#202020] hover:border-[#D78E59]/50'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePageSelection(page.id)}
                            className="mt-1 rounded border-[#202020] text-[#D78E59] focus:ring-[#D78E59] focus:ring-offset-0"
                          />
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-[#EDECF8] mb-1 truncate">
                                  {page.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[#828288] text-sm">
                                  <code className="bg-[#171717] px-2 py-1 rounded text-xs">
                                    /{page.slug}
                                  </code>
                                  <Badge variant={hasContent ? "default" : "secondary"} className="text-xs">
                                    {hasContent ? `${wordCount} words` : 'No content'}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-2 ml-4">
                                <Link href={`/${page.slug}`} target="_blank">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#171717]"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </Link>
                                
                                <Link href={`/page-editor?slug=${page.slug}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#171717]"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                
                                <Button
                                  onClick={() => duplicatePage(page.id)}
                                  disabled={actionLoading === `duplicate-${page.id}`}
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#171717]"
                                  title="Duplicate page"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                  onClick={() => deletePage(page.id)}
                                  disabled={actionLoading === `delete-${page.id}`}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  title="Delete page"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {page.description && (
                              <p className="text-[#828288] text-sm mb-3 line-clamp-2">
                                {page.description}
                              </p>
                            )}
                            
                            {/* Meta info */}
                            <div className="flex items-center justify-between text-xs text-[#828288]">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Created: {formatDate(page.created_at)}
                                </div>
                                {page.updated_at !== page.created_at && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Updated: {formatDate(page.updated_at)}
                                  </div>
                                )}
                              </div>
                              
                              {page.keywords && (
                                <div className="text-[#D78E59]">
                                  {page.keywords.split(',').length} tags
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {ConfirmDialog}
    </div>
  )
}