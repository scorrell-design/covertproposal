import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Everything is gated except the auth pages, the prospect-facing share view
// (/p/[token]), and the public view-tracking endpoint it calls.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/p/(.*)",
  "/api/public/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except Next internals and static files (unless in a query).
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
    // Clerk auto-proxy / handshake path.
    "/__clerk/:path*",
  ],
};
