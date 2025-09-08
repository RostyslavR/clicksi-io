/**
 * Content format conversion utilities
 * Handles conversion between HTML, Text, and JSON formats for page content
 */

export interface ContentNode {
  type: 'element' | 'text'
  tag?: string
  attributes?: Record<string, string>
  text?: string
  children?: ContentNode[]
}

export interface ContentData {
  html: string
  text: string
  json: ContentNode[]
}

/**
 * Convert HTML string to JSON structure
 */
export function htmlToJson(html: string): ContentNode[] {
  if (typeof window === 'undefined') {
    // Server-side: Simple parsing without DOM
    return parseHtmlToJson(html)
  }

  // Client-side: Use DOM parser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return domToJson(doc.body.childNodes)
}

/**
 * Server-side HTML to JSON parser (simplified)
 */
function parseHtmlToJson(html: string): ContentNode[] {
  const nodes: ContentNode[] = []
  
  // Simple regex-based parser for basic HTML
  const tagRegex = /<(\/?)\s*([^>]+)\s*>/g
  const segments = html.split(tagRegex)
  
  let i = 0
  while (i < segments.length) {
    const segment = segments[i]
    
    if (!segment) {
      i++
      continue
    }
    
    // Check if this is a tag
    if (i + 2 < segments.length && segments[i + 1]) {
      const isClosing = segments[i] === '/'
      const tagInfo = segments[i + 1]
      
      if (!isClosing && tagInfo) {
        const [tagName, ...attrParts] = tagInfo.trim().split(/\s+/)
        const attributes: Record<string, string> = {}
        
        // Parse attributes (simplified)
        attrParts.forEach(attr => {
          const [key, ...valueParts] = attr.split('=')
          if (key && valueParts.length > 0) {
            attributes[key] = valueParts.join('=').replace(/['"]/g, '')
          }
        })
        
        nodes.push({
          type: 'element',
          tag: tagName,
          attributes,
          children: []
        })
      }
      i += 3
    } else {
      // Text content
      const text = segment.trim()
      if (text) {
        nodes.push({
          type: 'text',
          text: text
        })
      }
      i++
    }
  }
  
  return nodes
}

/**
 * Convert DOM nodes to JSON structure (client-side)
 */
function domToJson(nodes: NodeList): ContentNode[] {
  const result: ContentNode[] = []
  
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        result.push({
          type: 'text',
          text: text
        })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const attributes: Record<string, string> = {}
      
      // Extract attributes
      Array.from(element.attributes).forEach(attr => {
        attributes[attr.name] = attr.value
      })
      
      result.push({
        type: 'element',
        tag: element.tagName.toLowerCase(),
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        children: domToJson(element.childNodes)
      })
    }
  })
  
  return result
}

/**
 * Convert JSON structure to HTML string
 */
export function jsonToHtml(nodes: ContentNode[]): string {
  return nodes.map(node => nodeToHtml(node)).join('')
}

function nodeToHtml(node: ContentNode): string {
  if (node.type === 'text') {
    return node.text || ''
  }
  
  if (node.type === 'element' && node.tag) {
    const attrs = node.attributes ? 
      Object.entries(node.attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('') : ''
    
    const children = node.children ? 
      node.children.map(child => nodeToHtml(child)).join('') : ''
    
    // Self-closing tags
    const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link']
    if (selfClosing.includes(node.tag) && !children) {
      return `<${node.tag}${attrs} />`
    }
    
    return `<${node.tag}${attrs}>${children}</${node.tag}>`
  }
  
  return ''
}

/**
 * Convert HTML to plain text (strip tags and styles)
 */
export function htmlToText(html: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: Use DOM
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }
  
  // Server-side: Regex-based tag removal
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

/**
 * Convert text back to HTML (preserve existing structure, update text content)
 */
export function textToHtml(text: string, originalJson: ContentNode[]): string {
  // If we have original JSON structure, try to preserve it
  if (originalJson.length > 0) {
    // Try to map text back to the original structure
    const updatedNodes = updateNodesWithText(originalJson, text)
    return jsonToHtml(updatedNodes)
  }
  
  // Fallback: create simple HTML structure from text
  const paragraphs = text.split('\n\n').filter(p => p.trim())
  if (paragraphs.length === 0) {
    return text // Return as-is if no paragraph structure
  }
  
  return paragraphs.map(p => {
    const trimmed = p.trim()
    // Check if it looks like a heading
    if (trimmed.length < 100 && !trimmed.includes('.') && trimmed === trimmed.toUpperCase()) {
      return `<h2>${trimmed}</h2>`
    }
    // Check if it's a list item
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
      return `<li>${trimmed.replace(/^[•\-\d\.]\s*/, '')}</li>`
    }
    // Regular paragraph
    return `<p>${trimmed}</p>`
  }).join('\n')
}

/**
 * Update JSON nodes with new text content while preserving structure
 */
function updateNodesWithText(nodes: ContentNode[], newText: string): ContentNode[] {
  const words = newText.split(/\s+/).filter(w => w)
  let wordIndex = 0
  
  function updateNode(node: ContentNode): ContentNode {
    if (node.type === 'text') {
      // Calculate how many words this text node should get
      // For simplicity, distribute words evenly across text nodes
      const wordsToTake = Math.ceil(words.length / countTextNodes(nodes))
      const nodeWords = words.slice(wordIndex, wordIndex + wordsToTake)
      wordIndex += wordsToTake
      
      return {
        ...node,
        text: nodeWords.join(' ')
      }
    }
    
    if (node.type === 'element' && node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNode(child))
      }
    }
    
    return node
  }
  
  return nodes.map(node => updateNode(node))
}

/**
 * Count text nodes in a JSON structure
 */
function countTextNodes(nodes: ContentNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.type === 'text') {
      return count + 1
    }
    if (node.type === 'element' && node.children) {
      return count + countTextNodes(node.children)
    }
    return count
  }, 0)
}

/**
 * Convert between different content formats
 */
export function convertContent(content: string, from: 'html' | 'text' | 'json', to: 'html' | 'text' | 'json', originalJson?: ContentNode[]): string {
  if (from === to) return content
  
  switch (`${from}-${to}`) {
    case 'html-json':
      return JSON.stringify(htmlToJson(content), null, 2)
    
    case 'html-text':
      return htmlToText(content)
    
    case 'json-html':
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content
        return jsonToHtml(parsed)
      } catch {
        return content
      }
    
    case 'json-text':
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content
        return htmlToText(jsonToHtml(parsed))
      } catch {
        return content
      }
    
    case 'text-html':
      return originalJson ? textToHtml(content, originalJson) : 
        content.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('\n')
    
    case 'text-json':
      const html = originalJson ? textToHtml(content, originalJson) : 
        content.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('\n')
      return JSON.stringify(htmlToJson(html), null, 2)
    
    default:
      return content
  }
}