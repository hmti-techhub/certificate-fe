import { auth } from "@/auth";
import { NextResponse } from "next/server";
/**
 * Proxy untuk auth check di edge
 * Menggantikan middleware.ts di Next.js 16+
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // ====================================
  // 1. DEFINE ROUTES
  // ====================================

  // Protected routes yang butuh authentication
  const protectedRoutes = ["/dashboard", "/admin", "/profile", "/events"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Auth routes (sign-in, sign-up, forgot-password, etc)
  const publicAuthRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Public routes yang tidak butuh auth
  const publicRoutes = ["/", "/docs", "/certificates"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  // ====================================
  // 2. HANDLE REDIRECTS
  // ====================================

  // Case 1: User TIDAK LOGIN mencoba akses PROTECTED route
  // → Redirect ke sign-in dengan callbackUrl
  if (isProtectedRoute && !session) {
    const signInUrl = new URL("/auth/sign-in", nextUrl.origin);

    console.log(
      `🔒 [Proxy] Unauthorized access to ${pathname}, redirecting to sign-in`,
    );
    return NextResponse.redirect(signInUrl);
  }

  // Case 2: User SUDAH LOGIN mencoba akses AUTH page (sign-in, sign-up)
  // → Redirect ke dashboard (sudah login, tidak perlu sign-in lagi)
  if (isPublicAuthRoute && session) {
    console.log(`✅ [Proxy] Already authenticated, redirecting to dashboard`);
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // Case 3: Public routes atau verify-email page
  // → Allow access tanpa auth check
  if (isPublicRoute || pathname.startsWith("/auth/verify-email")) {
    return NextResponse.next();
  }

  // Case 4: Default - Allow access
  return NextResponse.next();
});

/**
 * Matcher config untuk menentukan route mana yang di-handle proxy
 * Exclude static files, API routes NextAuth, dan _next
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth (NextAuth routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/auth|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
