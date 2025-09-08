export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
}

