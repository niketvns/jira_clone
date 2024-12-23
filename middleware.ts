import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const isProtectedRoute = createRouteMatcher(['/onboarding(.*)', '/organization(.*)', '/project(.*)', '/issue(.*)', '/sprint(.*)'])

export default clerkMiddleware(async (auth, request) => {
    if(isProtectedRoute(request)) {
        await auth.protect()
    }

    if((await auth()).userId && !(await auth()).orgId && request.nextUrl.pathname !== "/onboarding" && request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/onboarding", request.url))
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};