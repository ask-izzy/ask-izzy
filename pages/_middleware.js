/* @flow */

/*
It would be nice to be able to implement this as a simple redirect,
something like:

    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: "/((?!unsupported-browser.html$).*)",
                    has: [
                        {
                            type: "header",
                            key: "user-agent",
                            value: "(.*Trident.*)",
                        },
                    ],
                    hasNot: [
                        {
                            type: "header",
                            key: "cookie",
                            value: "(.*allowUnsupportedBrowser=true.*)",
                        },
                    ]
                    destination: "/unsupported-browser.html",
                },
            ],
        }
    },

Unfortunately Next.js does not yet support matching requests without
some property (in the above the "hasNot" option is made up) so for now
we're stuck with using a middleware.
*/


import { NextResponse } from "next/server"

export function middleware(req: any, event: any): any {
    let unsupportedBrowser = false

    const [, unsupportedBrowserCookieVal] = req.headers.get("cookie")
        ?.match(/unsupportedBrowser=(\w*)/) || []

    if (unsupportedBrowserCookieVal === "true") {
        unsupportedBrowser = true
    } else if (unsupportedBrowserCookieVal === undefined) {
        const isIE = Boolean(
            req.headers.get("user-agent")?.match(/Trident/)
        )
        if (isIE) {
            unsupportedBrowser = true
        }
    }

    if (unsupportedBrowser && !req.nextUrl.pathname.match(/\.\w*$/)) {
        const response = NextResponse.rewrite(
            new URL("/unsupported-browser.html", req.nextUrl.origin)
        )
        response.headers.set("set-cookie", "unsupportedBrowser=true; Path=/")
        return response
    }
}
