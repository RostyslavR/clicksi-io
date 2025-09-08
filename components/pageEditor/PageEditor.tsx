'use client'

import { useState, useEffect } from 'react'
import { Save, ArrowLeft, FileText, Code, Type, Layout } from 'lucide-react'
import Link from 'next/link'
import { convertContent, htmlToJson, ContentNode } from '@/lib/content-converter'

interface PageEditorProps {
  initialContent: string
  pageTitle: string
  onSave?: (content: { html: string; text: string; json: ContentNode[] }) => Promise<void>
  onLoadPrivacy?: (isHtmlMode: boolean) => string
  onLoadLandingPage?: () => string
}

export function PageEditor({ initialContent, pageTitle, onSave, onLoadPrivacy, onLoadLandingPage }: PageEditorProps) {
  const [htmlContent, setHtmlContent] = useState(initialContent)
  const [textContent, setTextContent] = useState('')
  const [jsonContent, setJsonContent] = useState<ContentNode[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  
  // Initialize text and JSON content from HTML
  useEffect(() => {
    if (initialContent) {
      const text = convertContent(initialContent, 'html', 'text')
      const json = htmlToJson(initialContent)
      setTextContent(text)
      setJsonContent(json)
    }
  }, [initialContent])

  // Sync content when switching modes or content changes
  const syncContent = (newContent: string, fromMode: 'html' | 'text') => {
    if (fromMode === 'html') {
      setHtmlContent(newContent)
      const text = convertContent(newContent, 'html', 'text')
      const json = htmlToJson(newContent)
      setTextContent(text)
      setJsonContent(json)
    } else if (fromMode === 'text') {
      setTextContent(newContent)
      const html = convertContent(newContent, 'text', 'html', jsonContent)
      const json = htmlToJson(html)
      setHtmlContent(html)
      setJsonContent(json)
    }
  }

  const handleSave = async () => {
    if (!onSave) return
    
    setSaving(true)
    try {
      await onSave({
        html: htmlContent,
        text: textContent,
        json: jsonContent
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLoadPrivacy = () => {
    if (!onLoadPrivacy) return
    
    const privacyContent = onLoadPrivacy(isHtmlMode)
    if (isHtmlMode) {
      syncContent(privacyContent, 'html')
    } else {
      syncContent(privacyContent, 'text')
    }
  }

  const handleLoadLandingPage = () => {
    if (!onLoadLandingPage) return
    
    const landingPageContent = onLoadLandingPage()
    syncContent(landingPageContent, 'html')
    setIsHtmlMode(true) // Switch to HTML mode for template
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDECF8]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center text-[#828288] hover:text-[#EDECF8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Edit {pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex bg-[#202020] rounded-lg p-1">
              <button
                onClick={() => setIsHtmlMode(false)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors text-sm ${
                  !isHtmlMode 
                    ? 'bg-[#D78E59] text-[#171717]' 
                    : 'text-[#828288] hover:text-[#EDECF8]'
                }`}
              >
                <Type className="w-4 h-4" />
                Text
              </button>
              <button
                onClick={() => setIsHtmlMode(true)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors text-sm ${
                  isHtmlMode 
                    ? 'bg-[#D78E59] text-[#171717]' 
                    : 'text-[#828288] hover:text-[#EDECF8]'
                }`}
              >
                <Code className="w-4 h-4" />
                HTML
              </button>
            </div>

            {onLoadPrivacy && (
              <button
                onClick={handleLoadPrivacy}
                className="flex items-center gap-2 px-4 py-2 bg-[#575757] text-[#EDECF8] rounded-lg hover:brightness-110 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Load Privacy Policy
              </button>
            )}

            {onLoadLandingPage && (
              <button
                onClick={handleLoadLandingPage}
                className="flex items-center gap-2 px-4 py-2 bg-[#575757] text-[#EDECF8] rounded-lg hover:brightness-110 transition-colors"
              >
                <Layout className="w-4 h-4" />
                Load Landing Template
              </button>
            )}
            
            {onSave && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  saved 
                    ? 'bg-green-600 text-white' 
                    : saving 
                      ? 'bg-[#575757] text-[#828288]' 
                      : 'bg-[#D78E59] text-[#171717] hover:brightness-110'
                }`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#EDECF8] mb-2">
              Page Content ({isHtmlMode ? 'HTML' : 'Text'} Mode)
            </label>
          </div>
          
          <textarea
            value={isHtmlMode ? htmlContent : textContent}
            onChange={(e) => syncContent(e.target.value, isHtmlMode ? 'html' : 'text')}
            className={`w-full h-[600px] bg-[#171717] border border-[#575757] rounded-lg p-4 text-[#EDECF8] text-sm resize-none focus:outline-none focus:border-[#D78E59] transition-colors ${
              isHtmlMode ? 'font-mono' : 'font-sans'
            }`}
            placeholder={isHtmlMode ? 'Enter your HTML content here...' : 'Enter your page content here...'}
            spellCheck={false}
          />
          
          <div className="mt-4 text-sm text-[#828288]">
            Characters: {(isHtmlMode ? htmlContent : textContent).length} | 
            HTML: {htmlContent.length} | Text: {textContent.length} | JSON: {JSON.stringify(jsonContent).length}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 bg-[#090909] rounded-2xl border border-[#202020] p-6">
          <h2 className="text-lg font-semibold mb-4">Preview ({isHtmlMode ? 'Rendered HTML' : 'Text'})</h2>
          <div className="bg-[#171717] rounded-lg p-4 max-h-[400px] overflow-y-auto">
            {isHtmlMode ? (
              <div 
                className="text-sm text-[#EDECF8] leading-relaxed prose prose-invert prose-sm max-w-none
                  prose-headings:text-[#EDECF8] prose-p:text-[#EDECF8] prose-strong:text-[#EDECF8] 
                  prose-em:text-[#EDECF8] prose-code:text-[#D78E59] prose-pre:bg-[#0A0A0A] 
                  prose-a:text-[#D78E59] prose-li:text-[#EDECF8]"
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-gray-500">Your HTML content will be rendered here...</p>' }}
              />
            ) : (
              <pre className="text-sm text-[#EDECF8] whitespace-pre-wrap font-sans leading-relaxed">
                {textContent || 'Your content will appear here...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}