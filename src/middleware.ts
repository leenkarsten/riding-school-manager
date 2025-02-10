import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // If not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated, check for profile and handle routing
  if (session) {
    // Get user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Handle missing profile
    if (profileError || !profile) {
      // Only redirect to login with error if not already on login or register page
      if (!isPublicRoute) {
        const redirectUrl = new URL('/login?error=profile_missing', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    // If on public route (login/register), redirect to appropriate dashboard
    if (isPublicRoute) {
      const redirectUrl = new URL(
        profile.role === 'admin' ? '/students' : '/dashboard',
        req.url
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Handle admin-only routes
    const adminRoutes = ['/students', '/add-student', '/competitions/manage'];
    const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (profile.role === 'student' && isAdminRoute) {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Update matcher to include all protected routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/students/:path*',
    '/dashboard/:path*',
    '/competitions/:path*'
  ]
};