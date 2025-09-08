'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { ClientNavigation as Navigation } from '@/components/ClientNavigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit, Code, Download, ArrowLeft, Home, Save, Settings, RotateCcw, Type, Link2, FileText as Description, Tag, Search, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { htmlToJson, jsonToHtml, ContentNode } from '@/lib/content-converter';
import { html_beautify } from 'js-beautify';

type EditMode = 'preview' | 'edit';

export default function PageEditor() {
  const searchParams = useSearchParams();
  const [editMode, setEditMode] = useState<EditMode>('edit');
  const [htmlContent, setHtmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState<ContentNode[]>([]);
  const [useSyntaxHighlighting, setUseSyntaxHighlighting] = useState(true);
  const [isLoading] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);
  const [isLoadingFromExternalUrl, setIsLoadingFromExternalUrl] = useState(false);
  const [urlToLoad, setUrlToLoad] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);
  const [hasLoadedContent, setHasLoadedContent] = useState(false);
  
  // Content filtering options
  const [removeHeader, setRemoveHeader] = useState(true);
  const [removeFooter, setRemoveFooter] = useState(true);
  const [removeNavigation, setRemoveNavigation] = useState(true);
  const [removeSidebar, setRemoveSidebar] = useState(true);
  
  // Page metadata
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    details?: string;
  } | null>(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };
  
  const handleConfirm = () => {
    confirmModal.onConfirm();
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };
  
  const handleCancel = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };
  
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, details?: string) => {
    setNotification({ type, message, details });
    // Auto-dismiss after 5 seconds for success/info, keep error/warning until manually dismissed
    if (type === 'success' || type === 'info') {
      setTimeout(() => setNotification(null), 5000);
    }
  };
  
  const dismissNotification = () => setNotification(null);

  // Auto-load page from URL parameters
  useEffect(() => {
    const slugParam = searchParams.get('slug');
    if (slugParam && !hasLoadedContent) {
      setUrlToLoad(slugParam);
      // Auto-load the page
      loadFromUrlWithSlug(slugParam);
    }
  }, [searchParams, hasLoadedContent]);

  const loadFromUrlWithSlug = async (slug: string) => {
    try {
      setIsLoadingFromUrl(true);
      
      console.log('Auto-loading from database with slug:', slug);
      
      // Try to load from database
      const dbResponse = await fetch(`/api/pages/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (dbResponse.ok) {
        const result = await dbResponse.json();
        if (result.success && result.data) {
          const data = result.data;
          
          const html = data.html || '';
          const json = data.json || [];
          
          setHtmlContent(html);
          setJsonContent(json);
          setPageTitle(data.title || '');
          setPageSlug(data.slug || '');
          setMetaDescription(data.meta_description || '');
          setMetaKeywords(Array.isArray(data.meta_keywords) ? data.meta_keywords.join(', ') : (data.meta_keywords || ''));
          setHasLoadedContent(true);
          setLastLoaded(new Date());
          setEditMode('preview');
          return;
        }
      }
      
      // If not found in database, don't show an alert, just clear the slug
      console.log('Page not found in database for slug:', slug);
      setUrlToLoad('');
    } catch (error) {
      console.error('Error auto-loading page:', error);
      setUrlToLoad('');
    } finally {
      setIsLoadingFromUrl(false);
    }
  };

  const loadFromUrl = async () => {
    try {
      setIsLoadingFromUrl(true);
      
      // Convert URL to slug for database lookup
      let slug = urlToLoad;
      if (slug.startsWith('/')) {
        slug = slug.substring(1); // Remove leading slash
      }
      
      console.log('Loading from database with slug:', slug);
      
      // First try to load from database
      const dbResponse = await fetch(`/api/pages/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (dbResponse.ok) {
        const result = await dbResponse.json();
        if (result.success && result.data) {
          const data = result.data;
          
          const html = data.html || '';
          const json = data.json || [];
          
          setHtmlContent(html);
          setJsonContent(json);
          setPageTitle(data.title || '');
          setPageSlug(data.slug || '');
          setMetaDescription(data.meta_description || '');
          setMetaKeywords(Array.isArray(data.meta_keywords) ? data.meta_keywords.join(', ') : (data.meta_keywords || ''));
          setHasLoadedContent(true);
          setLastLoaded(new Date());
          setEditMode('preview');
          return; // Success - exit early
        }
      }
      
      // If not found in database, show appropriate message
      showNotification('info', 'Page not found in database', 'Use "Load from Web" to fetch from external URL.');
    } catch (error) {
      console.error('Error loading content:', error);
      showNotification('error', 'Error loading page content', 'Please check the console for more details.');
    } finally {
      setIsLoadingFromUrl(false);
    }
  };

  const loadFromExternalUrl = async () => {
    try {
      setIsLoadingFromExternalUrl(true);
      
      // Validate that it's a full URL
      if (!externalUrl.trim()) {
        showNotification('warning', 'Please enter a URL');
        return;
      }
      
      if (!externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
        showNotification('warning', 'Please enter a full URL starting with http:// or https://');
        return;
      }
      
      console.log('Loading from external URL:', externalUrl);
      
      const response = await fetch('/api/page/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: externalUrl,
          removeHeader,
          removeFooter,
          removeNavigation,
          removeSidebar
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          const html = data.htmlContent || '';
          const json = data.jsonContent || [];
          
          setHtmlContent(html);
          setJsonContent(json);
          setPageTitle(data.title || '');
          setPageSlug(data.slug || '');
          setMetaDescription(data.description || '');
          setMetaKeywords(data.keywords || '');
          setHasLoadedContent(true);
          setLastLoaded(new Date());
          setEditMode('preview');
        } else {
          if (data.isClientRendered) {
            showNotification('warning', 'SPA Detected', `${data.error}\n\nFetched content preview:\n${data.fetchedContent || 'No preview available'}`);
          } else {
            showNotification('error', 'Failed to load page content', data.error || 'Unknown error');
          }
        }
      } else {
        const error = await response.json();
        if (error.isClientRendered) {
          showNotification('warning', 'SPA Detected', `${error.error}\n\nFetched content preview:\n${error.fetchedContent || 'No preview available'}`);
        } else {
          showNotification('error', 'Failed to load external URL', error.error || 'Unknown error');
        }
      }
    } catch (error) {
      console.error('Error loading external URL:', error);
      showNotification('error', 'Error loading external URL', 'Please check the console for more details.');
    } finally {
      setIsLoadingFromExternalUrl(false);
    }
  };

  const savePage = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/page/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug,
          description: metaDescription,
          keywords: metaKeywords,
          htmlContent: htmlContent,
          jsonContent: jsonContent,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        showNotification('success', 'Page saved successfully');
      } else {
        const error = await response.json();
        showNotification('error', 'Failed to save page', error.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      showNotification('error', 'Error saving page', 'Please check the console for more details.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetEditor = () => {
    showConfirmModal(
      'Reset Editor',
      'Are you sure you want to clear all content and settings? This action cannot be undone.',
      () => {
        // Clear all content
        setHtmlContent('');
        setJsonContent([]);
        
        // Clear page metadata
        setPageTitle('');
        setPageSlug('');
        setMetaDescription('');
        setMetaKeywords('');
        
        // Clear URLs
        setUrlToLoad('');
        setExternalUrl('');
        
        // Reset states
        setHasLoadedContent(false);
        setLastLoaded(null);
        setLastSaved(null);
        setEditMode('edit');
        
        // Reset content filtering options to defaults
        setRemoveHeader(true);
        setRemoveFooter(true);
        setRemoveNavigation(true);
        setRemoveSidebar(true);
        
        // Reset manual edit tracking
        setTitleManuallyEdited(false);
        setSlugManuallyEdited(false);
        
        showNotification('success', 'Editor reset successfully');
      }
    );
  };

  // Simple slug generation
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Keep only letters, numbers, and spaces
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-'); // Remove multiple dashes
  };

  // Simple title generation
  const generateTitle = (slug: string): string => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Validate slug
  const isValidSlug = (slug: string): boolean => {
    return /^[a-z0-9-]*$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
  };

  // Track if user has manually edited fields
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Handle title changes
  const handleTitleChange = (newTitle: string) => {
    setPageTitle(newTitle);
    setTitleManuallyEdited(true);
    
    // Auto-generate slug only if user hasn't manually edited it
    if (!slugManuallyEdited && newTitle.trim()) {
      setPageSlug(generateSlug(newTitle));
    }
  };

  // Handle slug changes
  const handleSlugChange = (newSlug: string) => {
    setPageSlug(newSlug);
    setSlugManuallyEdited(true);
    
    // Auto-generate title only if user hasn't manually edited it
    if (!titleManuallyEdited && newSlug.trim()) {
      setPageTitle(generateTitle(newSlug));
    }
  };

  // Modern HTML formatting with js-beautify
  const formatHtml = (html: string): string => {
    if (!html.trim()) return '';
    
    try {
      return html_beautify(html, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        wrap_line_length: 80, // Wrap long lines at 80 characters
        wrap_attributes: 'force-aligned', // Force wrap attributes
        end_with_newline: false,
        indent_inner_html: true,
        unformatted: ['pre', 'code'],
        extra_liners: []
      });
    } catch (error) {
      console.error('HTML formatting error:', error);
      return html; // Return original if formatting fails
    }
  };

  // Get formatted HTML for display in editor
  const getFormattedHtml = (): string => {
    return formatHtml(htmlContent);
  };


  // HTML ↔ JSON conversion with formatting
  const updateHtmlContent = (newHtml: string) => {
    setHtmlContent(newHtml);
    setJsonContent(htmlToJson(newHtml));
  };

  // Toggle Monaco Editor search
  const toggleSearch = () => {
    if (editorRef.current && useSyntaxHighlighting) {
      editorRef.current.getAction('actions.find')?.run();
    }
  };




  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading privacy policy...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6 max-w-6xl">
      {/* Notification Display */}
      {notification && (
        <Card className={`mb-4 border-l-4 ${
          notification.type === 'success' ? 'border-l-green-500 bg-green-50 dark:bg-green-950' :
          notification.type === 'error' ? 'border-l-red-500 bg-red-50 dark:bg-red-950' :
          notification.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
          'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    notification.type === 'success' ? 'text-green-800 dark:text-green-200' :
                    notification.type === 'error' ? 'text-red-800 dark:text-red-200' :
                    notification.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                    'text-blue-800 dark:text-blue-200'
                  }`}>
                    {notification.message}
                  </h4>
                  {notification.details && (
                    <p className={`mt-1 text-sm whitespace-pre-line ${
                      notification.type === 'success' ? 'text-green-700 dark:text-green-300' :
                      notification.type === 'error' ? 'text-red-700 dark:text-red-300' :
                      notification.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                      'text-blue-700 dark:text-blue-300'
                    }`}>
                      {notification.details}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissNotification}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {confirmModal.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {confirmModal.message}
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add CSS for click-to-navigate highlighting */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .highlight-element {
            background-color: rgba(255, 255, 0, 0.3) !important;
            outline: 2px solid #ffaa6c !important;
            transition: all 0.3s ease !important;
            border-radius: 4px !important;
          }
          
          [data-editor-line]:hover {
            cursor: pointer;
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-radius: 2px !important;
          }
          
          [data-editor-line] {
            transition: background-color 0.2s ease !important;
          }
        `
      }} />
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Page Editor</h1>
              <p className="text-muted-foreground">
                Create and manage your website pages
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {lastLoaded && (
              <Badge variant="secondary" className="text-sm">
                Last loaded: {lastLoaded.toLocaleTimeString()}
              </Badge>
            )}
            {lastSaved && (
              <Badge variant="outline" className="text-sm">
                Last saved: {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Page Metadata */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Page Settings
              </div>
              
              <div className="flex items-center gap-2">
                {/* Reset All Button */}
                <Button 
                  onClick={resetEditor} 
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
                
                {/* Save Page Button */}
                <Button onClick={savePage} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Page
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
              {/* Left Column: Title & Slug */}
              <div className="col-span-12 md:col-span-3 space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Type className="w-4 h-4 text-blue-500" />
                    Title
                  </label>
                  <Input
                    value={pageTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="My Awesome Page"
                    className="font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Link2 className="w-4 h-4 text-green-500" />
                    Slug
                  </label>
                  <Input
                    value={pageSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-awesome-page"
                    className={`font-mono text-sm ${
                      pageSlug && !isValidSlug(pageSlug) 
                        ? 'border-red-300 focus:border-red-500' 
                        : pageSlug 
                        ? 'border-green-300 focus:border-green-500' 
                        : ''
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      url: /{pageSlug || 'my-awesome-page'}
                    </p>
                    {pageSlug && !isValidSlug(pageSlug) && (
                      <p className="text-xs text-red-500">Invalid format</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Middle Column: Description */}
              <div className="col-span-12 md:col-span-5 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Description className="w-4 h-4 text-purple-500" />
                  Meta Description
                  <span className="text-xs text-muted-foreground">
                    ({metaDescription.length}/160)
                  </span>
                </label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Describe what this page is about. This appears in search results and social media shares. Keep it engaging and under 160 characters!"
                  className="h-24 resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  Optimal length: 120-160 characters
                </p>
              </div>
              
              {/* Right Column: Keywords */}
              <div className="col-span-12 md:col-span-4 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="w-4 h-4 text-orange-500" />
                  Keywords
                  <span className="text-xs text-muted-foreground">
                    ({metaKeywords.split(',').filter(k => k.trim()).length})
                  </span>
                </label>
                <Textarea
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="seo, web development, awesome page, marketing, content"
                  className="h-24 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Separate with commas. Use 5-10 relevant keywords.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Content Controls */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Load Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 items-center">
              {/* Database URL Input and Load Button */}
              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    value={urlToLoad}
                    onChange={(e) => setUrlToLoad(e.target.value)}
                    placeholder="page-slug"
                    className="w-64"
                  />
                  <Button
                    onClick={loadFromUrl}
                    disabled={isLoadingFromUrl || !urlToLoad.trim()}
                    variant="outline"
                    size="sm"
                  >
                    {isLoadingFromUrl ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Load from DB
                  </Button>
                </div>
              </div>
              
              {/* External URL Input and Load Button */}
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="Full URL (e.g., https://example.com/page)"
                  className="w-64"
                />
                <p className="text-xs text-muted-foreground">
                  Note: SPAs (React/Vue apps) may only return loading content
                </p>
              </div>
              <Button
                onClick={loadFromExternalUrl}
                disabled={isLoadingFromExternalUrl || !externalUrl.trim()}
                variant="outline"
                size="sm"
              >
                {isLoadingFromExternalUrl ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Load from Web
              </Button>
            </div>
            
            {/* Content Filtering Options */}
            <div className="flex gap-4 items-center text-sm">
              <span className="text-muted-foreground">Remove:</span>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={removeHeader}
                  onChange={(e) => setRemoveHeader(e.target.checked)}
                  className="rounded"
                />
                Header
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={removeFooter}
                  onChange={(e) => setRemoveFooter(e.target.checked)}
                  className="rounded"
                />
                Footer
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={removeNavigation}
                  onChange={(e) => setRemoveNavigation(e.target.checked)}
                  className="rounded"
                />
                Navigation
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={removeSidebar}
                  onChange={(e) => setRemoveSidebar(e.target.checked)}
                  className="rounded"
                />
                Sidebar
              </label>
            </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                HTML Content
              </div>
              
              {/* Mode Toggle Buttons */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={editMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setEditMode('preview')}
                  className="rounded-none"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={editMode === 'edit' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setEditMode('edit')}
                  className="rounded-none"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              {/* Syntax Colors Toggle - only show in edit mode */}
              {editMode === 'edit' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="syntax-highlighting"
                    checked={useSyntaxHighlighting}
                    onCheckedChange={(checked) => setUseSyntaxHighlighting(checked as boolean)}
                  />
                  <label 
                    htmlFor="syntax-highlighting" 
                    className="text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Code className="w-3 h-3" />
                    Syntax Colors
                  </label>
                </div>
              )}
            </div>
            
            {/* Search Button - only show in edit mode with Monaco */}
            {editMode === 'edit' && useSyntaxHighlighting && (
              <Button
                onClick={toggleSearch}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editMode === 'preview' ? (
            <div className="border rounded-lg p-4 min-h-[600px] max-h-[80vh] overflow-auto">
              {htmlContent.trim() === '' ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Code className="w-16 h-16 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Content</h3>
                  <p className="mb-4">Enter a URL above and click &quot;Load Page&quot; to import existing content,<br />or switch to &quot;Edit&quot; mode to create new content.</p>
                  <Button
                    onClick={() => setEditMode('edit')}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Start Editing
                  </Button>
                </div>
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="prose prose-invert max-w-none"
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="html-editor-container relative">
                {useSyntaxHighlighting ? (
                  // Monaco Editor with HTML syntax highlighting
                  <Editor
                    height="600px"
                    defaultLanguage="html"
                    value={getFormattedHtml()}
                    onChange={(value) => updateHtmlContent(value || '')}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: 'monospace',
                      wordWrap: 'on',
                      wrappingIndent: 'indent',
                      lineNumbers: 'on',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      folding: true,
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto'
                      },
                      find: {
                        seedSearchStringFromSelection: 'always',
                        addExtraSpaceOnTop: false,
                        autoFindInSelection: 'never'
                      }
                    }}
                    loading={<div className="flex items-center justify-center h-[600px] text-muted-foreground">Loading editor...</div>}
                  />
                ) : (
                  // Regular textarea editor
                  <Textarea
                    value={getFormattedHtml()}
                    onChange={(e) => updateHtmlContent(e.target.value)}
                    className="min-h-[600px] max-h-[80vh] w-full p-4 font-mono text-sm bg-background text-foreground border-border whitespace-pre-wrap"
                    placeholder="Enter HTML content here..."
                    spellCheck={false}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  />
                )}
                <div className="absolute top-2 right-2 bg-[#21262d] px-2 py-1 text-xs text-[#7d8590] rounded text-center border border-[#30363d]">
                  {useSyntaxHighlighting ? 'Monaco Editor (VS Code)' : 'Plain Text Editor'}
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  HTML format • {htmlContent.length} characters | JSON: {JSON.stringify(jsonContent).length}
                </span>
                <span>
                  {editMode === 'edit' ? 'Formatted HTML editor' : 'Preview mode'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </>
  );
}