import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
