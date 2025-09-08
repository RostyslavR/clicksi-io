'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const [errorDetails, setErrorDetails] = useState({
    error: '',
    errorCode: '',
    errorDescription: ''
  })

  useEffect(() => {
    // Parse parameters from both URL hash and search params
    const parseParams = () => {
      const params = new URLSearchParams()
      
      // First try to get from hash (fragment)
      if (window.location.hash) {
        const hashParams = window.location.hash.substring(1)
        const urlParams = new URLSearchParams(hashParams)
        urlParams.forEach((value, key) => params.set(key, value))
      }
      
      // Then overlay with search params (query string)
      searchParams.forEach((value, key) => params.set(key, value))
      
      return params
    }

    const params = parseParams()
    const error = params.get('error') || 'Unknown error'
    const errorCode = params.get('error_code') || ''
    const errorDescription = params.get('error_description') || ''

    setErrorDetails({
      error,
      errorCode,
      errorDescription: decodeURIComponent(errorDescription).replace(/\+/g, ' ')
    })
  }, [searchParams])

  const getErrorMessage = () => {
    if (errorDetails.errorCode === 'unexpected_failure') {
      return 'An unexpected error occurred during authentication. This may be a temporary issue.'
    }
    if (errorDetails.errorDescription.includes('Database error')) {
      return 'There was a database error while creating your account. Please try again.'
    }
    return errorDetails.errorDescription || 'An authentication error occurred.'
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#171717] rounded-2xl border border-[#202020] p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">
            Authentication Error
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-[#828288]">
              {getErrorMessage()}
            </p>
            
            {errorDetails.errorCode && (
              <div className="bg-[#202020] rounded-lg p-4 text-left">
                <h3 className="text-sm font-medium text-[#EDECF8] mb-2">Error Details:</h3>
                <div className="space-y-1 text-xs text-[#828288]">
                  <p><span className="text-[#EDECF8]">Error:</span> {errorDetails.error}</p>
                  {errorDetails.errorCode && (
                    <p><span className="text-[#EDECF8]">Code:</span> {errorDetails.errorCode}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/signup"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D78E59] text-[#171717] rounded-lg transition-colors duration-200 hover:brightness-110 font-semibold"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-[#EDECF8]">Loading...</div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}