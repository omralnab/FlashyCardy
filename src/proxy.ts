import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Required so `auth()` works in Server Components. Route protection for
 * `/decks/*` stays in each page (redirect to `/` when signed out).
 * Custom allow/deny in proxy was causing fragile session handling at the edge.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
