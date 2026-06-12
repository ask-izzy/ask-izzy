/* @flow */

import { NextRequest, NextResponse } from "next/server"
import { unsupportedBrowserRedirect } from "@/src/utils/nextjs-middleware/browser-support-check"
import { trailingSlashRedirect } from "@/src/utils/nextjs-middleware/trailing-slash-redirect"
import { rateLimitIfRequired } from "@/src/utils/nextjs-middleware/rate-limiting"

export async function middleware(req: typeof NextRequest): Promise<typeof NextResponse | void> {
    let response

    response = unsupportedBrowserRedirect(req)
    if (response) {
        return response
    }

    response = trailingSlashRedirect(req)
    if (response) {
        return response
    }

    response = await rateLimitIfRequired(req)
    if (response) {
        return response
    }
}

