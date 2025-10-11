import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  apiAuthPrefix,
  authRoutes,
  apiRoute,
} from "@/routes";
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;

  if (nextUrl.pathname === "/events") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  const isLoggedIn: boolean = !!req.auth;

  const isApiRoute: boolean = nextUrl.pathname.startsWith(apiRoute);
  const isApiAuthRoute: boolean = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute: boolean = publicRoutes.includes(nextUrl.pathname);
  const isCertificateRoute: boolean =
    nextUrl.pathname.startsWith("/certificates");
  const isStaticRoute: boolean = nextUrl.pathname.startsWith("/static");
  const isAuthRoute: boolean = authRoutes.includes(nextUrl.pathname);

  if (isCertificateRoute) {
    if (!isLoggedIn) {
      return;
    }
  }
  if (isStaticRoute) {
    if (!isLoggedIn) {
      return;
    }
  }

  // Untuk API auth routes (NextAuth), biarkan lewat
  if (isApiAuthRoute) return;
  if (isApiRoute) return;

  if (nextUrl.pathname === "/api/events") {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }
    return;
  }
  if (nextUrl.pathname === "/admin") {
    if (req.auth?.user.roles !== "SUPERADMIN") {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  if (nextUrl.pathname === "/auth/verify-email") {
    const token = nextUrl.searchParams.get("token");
    if (token) return;
    if (!token) {
      if (isLoggedIn) {
        return;
      } else {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
      }
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }
  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
