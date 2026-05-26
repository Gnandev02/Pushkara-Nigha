import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-for-dev-only"
);

// Add the routes that require authentication
const protectedRoutes = [
  "/",
  "/monitoring",
  "/reports",
  "/admin",
  "/users",
  "/analytics",
  "/cameras",
  "/settings",
];

// Add routes that are only for admin
const adminRoutes = ["/users", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow login page and API routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth") || !isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check for admin routes
    const isAdminRoute = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isAdminRoute && payload.role !== "admin") {
      // If not an admin trying to access admin routes, redirect to dashboard
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Clone headers and add user info for downstream use if needed
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    console.error("JWT Verification failed in middleware:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except auth might need protection, but we handle it case-by-case if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
