'use client'

import { useEffect, useState, useCallback } from 'react'
import { useEditMode } from '@/contexts/EditModeContext'
import { 
  scanPageForTextElements, 
  highlightTextElements, 
  removeHighlighting, 
  logTextElements,
  getHiddenTextElements,
  getVisibleTextElements,
  findTextElementsContaining,
  highlightHiddenTextElements,
  expandAllAccordions,
  type TextElement 
} from '@/lib/text-scanner'

export function useTextScanner() {
  const { isEditMode } = useEditMode()
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const scanPage = useCallback((expandAccordions = false) => {
    setIsScanning(true)
    
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      let elements: TextElement[]
      
      if (expandAccordions) {
        // Expand all accordions first, then scan
        expandAllAccordions()
        // Wait a bit more for accordion animations
        setTimeout(() => {
          elements = scanPageForTextElements()
          setTextElements(elements)
          
          if (process.env.NODE_ENV === 'development') {
            logTextElements(elements)
            console.log('🔧 Accordions expanded and page rescanned')
          }
          
          setIsScanning(false)
        }, 300)
      } else {
        elements = scanPageForTextElements()
        setTextElements(elements)
        
        if (process.env.NODE_ENV === 'development') {
          logTextElements(elements)
        }
        
        setIsScanning(false)
      }
    }, 100)
  }, [])

  // Scan page when component mounts
  useEffect(() => {
    scanPage()
  }, [scanPage])

  // Set up accordion click listener to rescan when items are expanded/collapsed
  useEffect(() => {
    if (!isEditMode) return

    const handleAccordionClick = (event: Event) => {
      const target = event.target as HTMLElement
      
      // Check if the clicked element is an accordion trigger
      if (target.getAttribute('aria-expanded') !== null || 
          target.closest('[aria-expanded]') ||
          target.closest('[data-state]')) {
        
        // Rescan after accordion animation completes
        setTimeout(() => {
          scanPage()
        }, 350)
      }
    }

    // Add event listener for clicks
    document.addEventListener('click', handleAccordionClick, true)

    return () => {
      document.removeEventListener('click', handleAccordionClick, true)
    }
  }, [isEditMode, scanPage])

  // Handle accordion expansion and highlighting when edit mode changes
  useEffect(() => {
    if (isEditMode) {
      // When entering edit mode, expand accordions and rescan
      expandAllAccordions()
      setTimeout(() => {
        scanPage(true) // This will expand accordions and rescan
      }, 100)
    } else {
      // When exiting edit mode, just remove highlighting
      removeHighlighting(textElements)
    }

    // Cleanup highlighting when component unmounts
    return () => {
      removeHighlighting(textElements)
    }
  }, [isEditMode, scanPage])

  // Handle highlighting when text elements change (without click handlers)
  useEffect(() => {
    if (textElements.length === 0 || !isEditMode) return

    highlightTextElements(textElements)
  }, [textElements, isEditMode])

  // Helper functions to work with the scanned elements
  const getHiddenElements = useCallback(() => getHiddenTextElements(textElements), [textElements])
  const getVisibleElements = useCallback(() => getVisibleTextElements(textElements), [textElements])
  const findElementsContaining = useCallback((searchText: string) => 
    findTextElementsContaining(textElements, searchText), [textElements])

  return {
    textElements,
    isScanning,
    scanPage,
    highlightElements: () => highlightTextElements(textElements),
    removeHighlighting: () => removeHighlighting(textElements),
    getHiddenElements,
    getVisibleElements,
    findElementsContaining,
    highlightHiddenElements: () => highlightHiddenTextElements(textElements),
    expandAccordions: () => {
      expandAllAccordions()
      setTimeout(() => scanPage(), 300)
    },
    isEditMode
  }
}