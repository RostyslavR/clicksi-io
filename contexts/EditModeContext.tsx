'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface EditModeContextType {
  isEditMode: boolean
  setEditMode: (mode: boolean) => void
  toggleEditMode: () => void
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const router = useRouter()


  const setEditMode = (mode: boolean) => {
    const wasEditMode = isEditMode
    setIsEditMode(mode)
    
    // Text editor functionality removed - no longer needed
  }

  const toggleEditMode = () => {
    setEditMode(!isEditMode)
  }

  // Add data attribute to document to track edit mode
  useEffect(() => {
    if (isEditMode) {
      document.documentElement.setAttribute('data-edit-mode', 'true')
    } else {
      document.documentElement.removeAttribute('data-edit-mode')
    }
  }, [isEditMode])

  return (
    <EditModeContext.Provider value={{
      isEditMode,
      setEditMode,
      toggleEditMode
    }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}