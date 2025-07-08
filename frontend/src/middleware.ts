import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do NOT require authentication
const publicRoutes = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // check it's a public route
  const isPublic = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const hasRefreshToken = request.cookies.has("refresh_token");

  if (isPublic && hasRefreshToken){
    return NextResponse.redirect(new URL("/explore", request.url));
  }else if (isPublic) {
    return NextResponse.next();
  }

  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
