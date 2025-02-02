import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes
  if (!session && req.nextUrl.pathname !== '/login') {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect from login if already authenticated
  if (session && req.nextUrl.pathname === '/login') {
    const redirectUrl = new URL('/students', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Only run middleware on specific routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};