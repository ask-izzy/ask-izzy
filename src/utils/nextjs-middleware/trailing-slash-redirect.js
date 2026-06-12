/* @flow */
import { NextRequest, NextResponse } from "next/server"

// We want to remove tailing slashes for Ask Izzy URLs to keep things neater but if we rewrite requests
// that are proxied using our external resources proxy that can produce unexpected behaviour. So we've
// disabled Next.js's automatic trailing slash redirection and we manually apply it here to all requests
// expect those to the proxy.
export function trailingSlashRedirect(req: typeof NextRequest): typeof NextResponse | void {
    const { pathname, href } = req.nextUrl

    if (
        pathname.endsWith("/") &&
        pathname.length > 1 &&
        (
            !process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX ||
            // For some reason if the request domain is "*.localhost" it is converted to converted to "localhost" in
            // req.nextUrl. So we can test the proxy locally using "*.localhost" domains we have to use
            // req.headers.host instead.
            !req.headers.get("host").match(`.${process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX || ""}(?::\\d+)?$`)
        )
    ) {
        return NextResponse.redirect(
            new URL(pathname.replace(/\/+$/, ""), href)
        )
    }
}
