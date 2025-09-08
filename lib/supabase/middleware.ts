import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect management routes (both /manage and route group variants)
  if ((request.nextUrl.pathname.startsWith('/manage') || request.nextUrl.pathname.includes('/manage/')) && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect page manager routes
  if (request.nextUrl.pathname.startsWith('/page-manager') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect page editor routes
  if (request.nextUrl.pathname.startsWith('/page-editor') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect visual builder routes
  if (request.nextUrl.pathname.includes('/visual-builder/') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect edit routes
  if (request.nextUrl.pathname.startsWith('/edit/') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect authenticated routes (dashboard)
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}