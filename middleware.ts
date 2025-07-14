import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/change-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow static files and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }

  // ✅ Allow public routes without auth
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Check auth status from Django
  const res = await fetch('https://rahis.pythonanywhere.com/auth/status/', {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  if (res.ok) {
    const data = await res.json();

    if (data.authenticated) {
      const isStaff = data.is_staff;
      const isSuperuser = data.is_superuser;

      // ❌ If user is NOT staff/superuser and accessing /admin → redirect to /home
      if (
        pathname.startsWith('/admin') &&
        (!isStaff && !isSuperuser)
      ) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = '/';
        return NextResponse.redirect(homeUrl);
      }

      // ✅ All other authenticated access
      return NextResponse.next();
    }
  }

  // ❌ Not authenticated, redirect if trying to access a protected route
  if (!PUBLIC_PATHS.includes(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|images|uploads).*)'],
};
