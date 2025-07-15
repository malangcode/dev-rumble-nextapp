import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';


const PUBLIC_PATHS = ['/', '/login', '/signup', '/change-password'];
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // should match Django's JWT_SECRET

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow static and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }

  // ✅ Allow public routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Get JWT from cookie
  const token = request.cookies.get('access_token')?.value;

  if (token) {
    try {
      // 🔐 Verify and decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const isStaff = decoded.is_staff;
      const isSuperuser = decoded.is_superuser;

      // ❌ Block access to /admin for regular users
      if (pathname.startsWith('/admin') && (!isStaff && !isSuperuser)) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = '/';
        return NextResponse.redirect(homeUrl);
      }

      // ✅ All good, allow request
      return NextResponse.next();
    } catch (err) {
      // 🔴 Invalid or expired token
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🔴 No token at all → force login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|images|uploads).*)'],
};
