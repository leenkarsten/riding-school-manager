import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth Required Routes
  if (req.nextUrl.pathname.startsWith('/students') || 
      req.nextUrl.pathname.startsWith('/lessons') || 
      req.nextUrl.pathname.startsWith('/competitions')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Already logged in
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/students', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/students/:path*', '/lessons/:path*', '/competitions/:path*', '/login']
};