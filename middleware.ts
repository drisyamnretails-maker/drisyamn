// middleware.ts - project root me
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => req.cookies.get(name)?.value, set: (name, value, options) => res.cookies.set({ name, value,...options }), remove: (name, options) => res.cookies.set({ name, '',...options }) } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  // 1. Agar login nahi hai aur home/feed khol raha hai -> login pe bhejo
  if(!user && (path === '/' || path.startsWith('/feed') || path.startsWith('/profile'))){
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 2. Agar login hai aur onboarding pura nahi kiya -> onboarding pe bhejo
  if(user){
    const { data: profile } = await supabase.from('profiles').select('onboarding_done').eq('id', user.id).maybeSingle()
    if(profile &&!profile.onboarding_done &&!path.startsWith('/onboarding') &&!path.startsWith('/login')){
      return NextResponse.redirect(new URL('/onboarding/role', req.url))
    }
    // 3. Agar login hai aur login/signup pe ja raha hai -> home pe bhejo
    if(path.startsWith('/login') || path.startsWith('/signup')){
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = { matcher: ['/', '/feed/:path*', '/profile/:path*', '/onboarding/:path*', '/login', '/signup'] }