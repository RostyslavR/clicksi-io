export interface TextElement {
  element: HTMLElement
  text: string
  tagName: string
  id?: string
  className?: string
  xpath: string
  isVisible: boolean
  isHidden: boolean
  hiddenReason?: string
}

/**
 * Gets the XPath for a given element
 */
function getXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }
  
  if (element === document.body) {
    return '/html/body'
  }
  
  const parent = element.parentElement
  if (!parent) {
    return '/' + element.tagName.toLowerCase()
  }
  
  const siblings = Array.from(parent.children).filter(
    child => child.tagName === element.tagName
  )
  
  if (siblings.length === 1) {
    return getXPath(parent) + '/' + element.tagName.toLowerCase()
  }
  
  const index = siblings.indexOf(element) + 1
  return getXPath(parent) + '/' + element.tagName.toLowerCase() + `[${index}]`
}

/**
 * Checks if an element contains meaningful text content
 */
function hasTextContent(element: HTMLElement): boolean {
  const text = element.textContent?.trim() || ''
  
  // Skip empty or whitespace-only content
  if (!text) return false
  
  // Skip very short text (likely symbols or single characters)
  if (text.length < 2) return false
  
  // Skip if it's just numbers or special characters
  if (/^[\d\s\-_.,!@#$%^&*()+={}[\]|\\:";'<>?/~`]*$/.test(text)) return false
  
  return true
}

/**
 * Checks if element should be excluded from text scanning (only excludes non-content elements)
 */
function shouldExcludeElement(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase()
  
  // Exclude script, style, noscript tags
  const excludedTags = ['script', 'style', 'noscript', 'meta', 'link', 'head', 'title']
  if (excludedTags.includes(tagName)) return true
  
  // Exclude elements with specific roles or data attributes
  if (element.getAttribute('data-exclude-scan') === 'true') return true
  
  // Exclude navigation elements first (more specific)
  const nav = element.closest('nav')
  if (nav) return true
  
  // Allow FAQ accordion triggers (they should be editable)
  const accordionTrigger = element.closest('[class*="AccordionTrigger"]') || 
                          element.closest('[data-state]') ||
                          element.closest('[role="button"][aria-expanded]')
  if (accordionTrigger) {
    // Allow editing accordion trigger text content
    return false
  }
  
  // Exclude other buttons (like Edit/Exit Edit)
  if (tagName === 'button') return true
  if (element.getAttribute('role') === 'button') return true
  
  // Exclude elements inside non-accordion buttons
  const parentButton = element.closest('button')
  if (parentButton && !parentButton.closest('[class*="Accordion"]')) return true
  
  // Exclude text scanner UI elements
  if (element.closest('[class*="fixed"]') && element.closest('[class*="z-50"]')) return true
  
  // Exclude modal and overlay elements
  if (element.closest('[class*="modal"]') || element.closest('[class*="overlay"]')) return true
  
  return false
}

/**
 * Checks if an element is hidden and determines the reason
 */
function getVisibilityInfo(element: HTMLElement): { isVisible: boolean, isHidden: boolean, hiddenReason?: string } {
  const style = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  
  // Check various ways an element can be hidden
  if (style.display === 'none') {
    return { isVisible: false, isHidden: true, hiddenReason: 'display: none' }
  }
  
  if (style.visibility === 'hidden') {
    return { isVisible: false, isHidden: true, hiddenReason: 'visibility: hidden' }
  }
  
  if (style.opacity === '0') {
    return { isVisible: false, isHidden: true, hiddenReason: 'opacity: 0' }
  }
  
  if (rect.width === 0 && rect.height === 0) {
    return { isVisible: false, isHidden: true, hiddenReason: 'zero dimensions' }
  }
  
  // Check if element is outside viewport (clipped)
  if (rect.left > window.innerWidth || rect.right < 0 || rect.top > window.innerHeight || rect.bottom < 0) {
    return { isVisible: false, isHidden: true, hiddenReason: 'outside viewport' }
  }
  
  // Check for accordion-style hiding (data attributes or aria-hidden)
  if (element.getAttribute('aria-hidden') === 'true') {
    return { isVisible: false, isHidden: true, hiddenReason: 'aria-hidden=true' }
  }
  
  // Check for collapsed accordion content (height: 0 but not display: none)
  if (rect.height === 0 && style.overflow === 'hidden') {
    return { isVisible: false, isHidden: true, hiddenReason: 'collapsed (height: 0, overflow: hidden)' }
  }
  
  return { isVisible: true, isHidden: false }
}

/**
 * Scans the page for all text elements
 */
export function scanPageForTextElements(): TextElement[] {
  const textElements: TextElement[] = []
  const visited = new Set<HTMLElement>()
  
  function scanElement(element: HTMLElement) {
    if (visited.has(element) || shouldExcludeElement(element)) {
      return
    }
    
    visited.add(element)
    
    // Check if this element has direct text content (not just from children)
    const hasDirectText = Array.from(element.childNodes).some(
      node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
    )
    
    // If element has direct text content and is a text-containing element
    if (hasDirectText && hasTextContent(element)) {
      const text = element.textContent?.trim() || ''
      const visibilityInfo = getVisibilityInfo(element)
      
      textElements.push({
        element,
        text,
        tagName: element.tagName.toLowerCase(),
        id: element.id || undefined,
        className: element.className || undefined,
        xpath: getXPath(element),
        isVisible: visibilityInfo.isVisible,
        isHidden: visibilityInfo.isHidden,
        hiddenReason: visibilityInfo.hiddenReason
      })
    }
    
    // Recursively scan children
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        scanElement(child)
      }
    })
  }
  
  // Start scanning from body
  if (document.body) {
    scanElement(document.body)
  }
  
  return textElements
}

/**
 * Highlights text elements on the page for visual debugging
 */
export function highlightTextElements(elements: TextElement[], onElementClick?: (element: TextElement) => void) {
  elements.forEach((textElement) => {
    const { element } = textElement
    
    // First remove any existing handlers to prevent duplicates
    const existingHandlers = (element as HTMLElement & { _textScannerHandlers?: { mouseenter: () => void; mouseleave: () => void; click: () => void } })._textScannerHandlers
    if (existingHandlers) {
      element.removeEventListener('mouseenter', existingHandlers.mouseenter)
      element.removeEventListener('mouseleave', existingHandlers.mouseleave)
      element.removeEventListener('click', existingHandlers.click)
    }
    
    element.style.outline = '1px solid #D78E59'
    element.style.backgroundColor = 'rgba(215, 142, 89, 0.1)'
    element.style.cursor = onElementClick ? 'pointer' : 'default'
    element.style.transition = 'all 0.2s ease'
    
    // Check if this is an accordion trigger for special click handling
    const isAccordionTrigger = element.closest('[class*="AccordionTrigger"]') || 
                               element.closest('[data-state]') ||
                               element.closest('[role="button"][aria-expanded]')
    
    // Add hover effect
    const handleMouseEnter = () => {
      element.style.backgroundColor = 'rgba(215, 142, 89, 0.2)'
      element.style.outline = '2px solid #D78E59'
    }
    
    const handleMouseLeave = () => {
      element.style.backgroundColor = 'rgba(215, 142, 89, 0.1)'
      element.style.outline = '1px solid #D78E59'
    }
    
    const handleClick = (e: Event) => {
      // Always check if we're in edit mode first
      const isEditMode = document.querySelector('[data-edit-mode="true"]') !== null
      
      if (!isEditMode) {
        // Not in edit mode: don't interfere at all
        return
      }
      
      // Ignore programmatic clicks from accordion expansion (detail: -1)
      const mouseEvent = e as MouseEvent
      if (mouseEvent.detail === -1) {
        console.log('🔄 Ignoring programmatic accordion expansion click')
        return
      }
      
      // Special handling for accordion triggers
      if (isAccordionTrigger) {
        // Track click location for accordion handling
        
        // Check if click was on text content vs button area
        const textNodes = Array.from(element.childNodes).filter(
          node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        )
        
        // If we have text nodes, check if click was close to text
        let isTextClick = false
        if (textNodes.length > 0) {
          // For accordion triggers, we'll be more permissive about text clicks
          // since the entire trigger area contains the question text
          const elementRect = element.getBoundingClientRect()
          const clickX = (e as MouseEvent).clientX - elementRect.left
          // Focus on horizontal position for text vs button detection
          
          // Consider it a text click if it's in the main content area
          // (not in the rightmost 40px where the chevron usually is)
          isTextClick = clickX < elementRect.width - 40
        }
        
        if (isTextClick) {
          // Click on text - open editor
          e.preventDefault()
          e.stopPropagation()
          console.log('🖱️ Edit mode: Opening editor for accordion text:', textElement.text.substring(0, 30))
          
          if (onElementClick) {
            onElementClick(textElement)
          }
        } else {
          // Click on button area (right side) - let accordion work normally
          console.log('🔘 Accordion button click - allowing normal behavior')
          // Don't prevent default, let the accordion handle it
        }
        
        return
      }
      
      // For non-accordion elements: prevent default and open editor
      e.preventDefault()
      e.stopPropagation()
      console.log('🖱️ Edit mode: Opening editor for text:', textElement.text.substring(0, 30))
      
      if (onElementClick) {
        onElementClick(textElement)
      }
    }
    
    // Only add click handler if callback provided
    if (onElementClick) {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
      element.addEventListener('click', handleClick)
      
      // Store handlers on element for cleanup
      ;(element as HTMLElement & { _textScannerHandlers?: { mouseenter: () => void; mouseleave: () => void; click: (e: Event) => void } })._textScannerHandlers = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        click: handleClick
      }
    }
  })
}

/**
 * Removes highlighting from text elements
 */
export function removeHighlighting(elements: TextElement[]) {
  elements.forEach(({ element }) => {
    element.style.outline = ''
    element.style.backgroundColor = ''
    element.style.cursor = ''
    element.style.transition = ''
    
    // Remove event listeners
    const handlers = (element as HTMLElement & { _textScannerHandlers?: { mouseenter: () => void; mouseleave: () => void; click: (e: Event) => void } })._textScannerHandlers
    if (handlers) {
      element.removeEventListener('mouseenter', handlers.mouseenter)
      element.removeEventListener('mouseleave', handlers.mouseleave)
      element.removeEventListener('click', handlers.click)
      delete (element as HTMLElement & { _textScannerHandlers?: { mouseenter: () => void; mouseleave: () => void; click: (e: Event) => void } })._textScannerHandlers
    }
    
    // Remove any overlay elements that might have been added
    const overlay = (element as HTMLElement & { _textScannerOverlay?: HTMLElement })._textScannerOverlay
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay)
      delete (element as HTMLElement & { _textScannerOverlay?: HTMLElement })._textScannerOverlay
    }
  })
}

/**
 * Filters text elements to find only hidden ones
 */
export function getHiddenTextElements(elements: TextElement[]): TextElement[] {
  return elements.filter(el => el.isHidden)
}

/**
 * Filters text elements to find only visible ones
 */
export function getVisibleTextElements(elements: TextElement[]): TextElement[] {
  return elements.filter(el => el.isVisible)
}

/**
 * Finds text elements containing specific text (case insensitive)
 */
export function findTextElementsContaining(elements: TextElement[], searchText: string): TextElement[] {
  return elements.filter(el => 
    el.text.toLowerCase().includes(searchText.toLowerCase())
  )
}

/**
 * Expands all accordion elements to reveal hidden content
 */
export function expandAllAccordions() {
  // Find accordion triggers (typically buttons with aria-expanded)
  const triggers = document.querySelectorAll('[aria-expanded="false"]')
  
  triggers.forEach(trigger => {
    if (trigger instanceof HTMLElement) {
      // Temporarily disable text scanner click handlers during expansion
      const editMode = document.querySelector('[data-edit-mode="true"]') !== null
      
      if (editMode) {
        // Dispatch a temporary disable event
        // Text editor events removed - no longer needed
      }
      
      // Use a synthetic click that bypasses text editor handlers
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        // Add a flag to identify this as a programmatic accordion expansion
        detail: -1 // Negative detail indicates programmatic click
      })
      
      trigger.dispatchEvent(clickEvent)
      
      if (editMode) {
        // Re-enable after a brief delay
        setTimeout(() => {
          // Text editor events removed - no longer needed
        }, 50)
      }
    }
  })
}

/**
 * Scans for accordion content and expands them to include in text detection
 */
export function scanWithAccordionExpansion(): TextElement[] {
  // First, expand all accordions
  expandAllAccordions()
  
  // Wait a brief moment for animations to complete, then scan
  setTimeout(() => {
    return scanPageForTextElements()
  }, 200)
  
  // Return current elements immediately as well
  return scanPageForTextElements()
}

/**
 * Highlights hidden text elements with a different color
 */
export function highlightHiddenTextElements(elements: TextElement[]) {
  const hiddenElements = getHiddenTextElements(elements)
  hiddenElements.forEach(({ element }) => {
    element.style.outline = '2px dashed #FF6B6B'
    element.style.backgroundColor = 'rgba(255, 107, 107, 0.1)'
  })
}

/**
 * Logs text elements to console for debugging with visibility info
 */
export function logTextElements(elements: TextElement[]) {
  const visibleCount = elements.filter(el => el.isVisible).length
  const hiddenCount = elements.filter(el => el.isHidden).length
  
  console.group(`🔍 Text Elements Found: ${elements.length} (${visibleCount} visible, ${hiddenCount} hidden)`)
  
  elements.forEach((textEl, index) => {
    const status = textEl.isHidden ? '🙈 HIDDEN' : '👁️ VISIBLE'
    const reason = textEl.hiddenReason ? ` (${textEl.hiddenReason})` : ''
    
    console.log(`${index + 1}. ${status}${reason}`, {
      tag: textEl.tagName,
      text: textEl.text.substring(0, 50) + (textEl.text.length > 50 ? '...' : ''),
      id: textEl.id,
      className: textEl.className,
      xpath: textEl.xpath,
      element: textEl.element
    })
  })
  console.groupEnd()
  
  // Log hidden elements separately for easy access
  if (hiddenCount > 0) {
    console.group(`🙈 Hidden Text Elements: ${hiddenCount}`)
    getHiddenTextElements(elements).forEach((textEl, index) => {
      console.log(`${index + 1}. ${textEl.hiddenReason}`, {
        text: textEl.text.substring(0, 100) + (textEl.text.length > 100 ? '...' : ''),
        element: textEl.element
      })
    })
    console.groupEnd()
  }
}