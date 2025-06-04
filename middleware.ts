import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/change-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow Next.js static files and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/images') || // optional: if you have /public/images/*
    pathname.startsWith('/uploads')   // optional: if you store files in /public/uploads
  ) {
    return NextResponse.next();
  }

  // ✅ Allow public routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Check authentication from Django backend
  const res = await fetch('http://localhost:8000/auth/status/', {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  if (res.ok) {
    const data = await res.json();
    if (data.authenticated) {
      return NextResponse.next();
    }
  }

  // ❌ Not authenticated, redirect to login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|images|uploads).*)'],
};
