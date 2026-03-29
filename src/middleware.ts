import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Only run Clerk middleware on routes that need auth.
  // The landing page (/) and other public pages are intentionally excluded
  // so the app works even when Clerk env vars are not set.
  matcher: [
    "/admin(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
  ],
};
