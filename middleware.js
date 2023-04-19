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
    console.log("---", req.nextUrl.pathname)
    let response

    response = unsupportedBrowserRedirect(req, event)
    if (response) {
        return response
    }

    response = trailingSlashRedirect(req, event)
    if (response) {
        return response
    }

    response = betaRedirect(req, event)
    if (response) {
        return response
    }
}

function unsupportedBrowserRedirect(req: any, event: any): any {
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

// We want to remove tailing slashes for Ask Izzy URLs to keep things neater but if we rewrite requests
// that are proxied using our external resources proxy that can produce unexpected behaviour. So we've
// disabled Next.js's automatic trailing slash redirection and we manually apply it here to all requests
// expect those to the proxy.
function trailingSlashRedirect(req: any, event: any): any {
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






const COOKIE_NAME = 'bucket-marketing'

// Choose a random bucket
// Optional: contact a 3rd party service to get the user's bucket
const MARKETING_BUCKETS = ['production', 'beta']
const getBucket = () => MARKETING_BUCKETS[Math.floor(Math.random() * MARKETING_BUCKETS.length)]

export function betaRedirect(req: NextRequest) {
  const { pathname, href } = req.nextUrl

  // Get the bucket cookie
  const bucket = req.cookies.get(COOKIE_NAME)?.value || getBucket()
  // Proxy to the appropriate variant

  let res

  if (bucket === "beta") {
    const url = new URL(pathname, "https://ask-izzy.uat.ixapps.org")
    res = NextResponse.rewrite(url)
    console.log("rewrite to", url)
  } else {
    console.log("----", href)
    res = NextResponse.next()
  }

  // Add the bucket to cookies if it's not there
  if (!req.cookies.has(COOKIE_NAME)) {
    console.log("set cookie")
    res.cookies.set(COOKIE_NAME, bucket)
  }

  return res
}


// export const config = {
//   matcher: '/',
// }
