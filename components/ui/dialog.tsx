"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "./button"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
}

interface DialogTitleProps {
  children: React.ReactNode
}

interface DialogDescriptionProps {
  children: React.ReactNode
}

interface DialogFooterProps {
  children: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {}
})

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
  const { open, onOpenChange } = React.useContext(DialogContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className={`relative bg-[#090909] border border-[#202020] rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 text-[#828288] hover:text-[#EDECF8]"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-4 h-4" />
        </Button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="p-6 pb-0">{children}</div>
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold text-[#EDECF8]">{children}</h2>
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-[#828288] mt-2">{children}</p>
}

export function DialogFooter({ children }: DialogFooterProps) {
  return <div className="p-6 pt-0 flex items-center justify-end gap-2">{children}</div>
}