import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection by trying to access user_profiles table
    const { error: tablesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    if (tablesError) {
      return NextResponse.json({ 
        error: 'Failed to check tables', 
        details: tablesError 
      }, { status: 500 })
    }

    // Check user_profiles table structure
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    // Check current auth user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    // Safe error message extraction
    const getErrorMsg = (err: unknown) => {
      if (!err) return null
      if (typeof err === 'object' && err !== null && 'message' in err) {
        return String((err as { message: unknown }).message)
      }
      return String(err)
    }

    return NextResponse.json({
      success: true,
      tablesAccessible: !tablesError,
      tablesError: getErrorMsg(tablesError),
      canAccessProfiles: !profilesError,
      profilesError: getErrorMsg(profilesError),
      currentUser: user ? { id: user.id, email: user.email } : null,
      userError: getErrorMsg(userError),
      profilesData: profilesData ? profilesData.length : 0
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: String(error)
    }, { status: 500 })
  }
}