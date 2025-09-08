// Maps Supabase error codes to translation keys
export function getAuthErrorMessage(error: { message?: string; code?: string } | null, t: (key: string) => string): string {
  if (!error) return t('auth.errors.generic')
  
  const errorMessage = error.message?.toLowerCase() || ''
  const errorCode = error.code || ''
  
  // Map common Supabase auth errors to translation keys
  if (errorMessage.includes('invalid login credentials') || errorCode === 'invalid_credentials') {
    return t('auth.errors.invalidCredentials')
  }
  
  if (errorMessage.includes('user not found') || errorCode === 'user_not_found') {
    return t('auth.errors.userNotFound')
  }
  
  if (errorMessage.includes('email already registered') || errorMessage.includes('already registered')) {
    return t('auth.errors.emailAlreadyInUse')
  }
  
  if (errorMessage.includes('password') && (errorMessage.includes('short') || errorMessage.includes('weak'))) {
    return t('auth.errors.weakPassword')
  }
  
  if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
    return t('auth.errors.invalidEmail')
  }
  
  if (errorMessage.includes('too many requests') || errorCode === 'too_many_requests') {
    return t('auth.errors.tooManyRequests')
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return t('auth.errors.networkError')
  }
  
  // Fallback to generic error
  return t('auth.errors.generic')
}

// Validates email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validates password strength
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

// Get success message for auth actions
export function getAuthSuccessMessage(action: 'signIn' | 'signUp' | 'passwordReset' | 'signOut', t: (key: string) => string): string {
  switch (action) {
    case 'signIn':
      return t('auth.success.signInSuccess')
    case 'signUp':
      return t('auth.success.signUpComplete')
    case 'passwordReset':
      return t('auth.success.passwordResetSent')
    case 'signOut':
      return t('auth.success.signOutSuccess')
    default:
      return t('auth.errors.generic')
  }
}