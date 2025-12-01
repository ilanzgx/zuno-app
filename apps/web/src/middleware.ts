import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "@/resources/user/user.service";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/entrar" || pathname === "/registrar";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (token && isAuthRoute) {
    const isValid = await validateToken();
    if (isValid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
  }

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/entrar", request.url));
    }

    const isValid = await validateToken();
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/entrar", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
