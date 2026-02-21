import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;

  if (!token && !request.nextUrl.pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chats/:path*",
    "/profile/:path*",
    "/ai/:path*",
    "/settings/:path*",
  ], // Protect specific routes
};
