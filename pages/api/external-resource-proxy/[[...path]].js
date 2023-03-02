/* @flow */
// We currently can't do with Next.js rewrites due to this bug
// https://github.com/vercel/next.js/issues/37028 stopping us
// proxying the google maps api
import { createProxyMiddleware } from "http-proxy-middleware";

import { unflattenDomain } from "@/helpers/url.helpers"

const allowedDomains = new Set(process.env.DOMAINS_TO_PROXY)

const proxyMiddleware = createProxyMiddleware({
    router: req => getTargetBaseUrl(req).origin,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        if (proxyReq.method === "OPTIONS") {
            const corsReqHeadersHeaderName = "access-control-request-headers"
            if (proxyReq.hasHeader(corsReqHeadersHeaderName)) {
                proxyReq.setHeader(
                    corsReqHeadersHeaderName,
                    proxyReq.getHeader(corsReqHeadersHeaderName)
                        .split(",")
                        .filter(
                            headerName => !["baggage", "sentry-trace"].includes(headerName.trim().toLowerCase())
                        )
                        .join(",")
                )
            }
        } else {
            proxyReq.removeHeader("baggage")
            proxyReq.removeHeader("sentry-trace")
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        if (req.method === "OPTIONS") {
            const corsReqHeadersHeaderName = "access-control-allow-headers"
            if (proxyRes.headers[corsReqHeadersHeaderName]) {
                const ensureHeaderNameIncluded = (headerNameToInclude) => {
                    const hasHeader = proxyRes.headers[corsReqHeadersHeaderName]
                        .split(",")
                        .some(headerName => headerName.trim().toLowerCase() === headerNameToInclude)
                    if (!hasHeader) {
                        proxyRes.headers[corsReqHeadersHeaderName] += `, ${headerNameToInclude}`
                    }
                }
                ensureHeaderNameIncluded("Sentry-Trace")
                ensureHeaderNameIncluded("Baggage")
            }
        }
    },
});

export default function handler(req: any, res: any): void {
    if (!process.env.DOMAINS_TO_PROXY) {
        return res.status(400).send("Route not available");
    }
    const targetBaseUrl = getTargetBaseUrl(req)

    if (!allowedDomains.has(targetBaseUrl.host)) {
        console.error(`Tried to proxy "${targetBaseUrl.host}" but that domain is not the DOMAINS_TO_PROXY env var`)
        return res.status(400).send("Domain not allowed");
    }
    proxyMiddleware(req, res, (result: any) => {
        if (result instanceof Error) {
            throw result;
        }
    });
}

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
};

function getTargetBaseUrl(req: any) {
    const targetDomain = unflattenDomain(
        req.headers.host.replace(
            new RegExp(`.${process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX || ""}(?::\\d+)?$`),
            ""
        )
    )
    const baseUrlString = `https://${targetDomain}`
    // Construct URL object to confirm url is valid
    try {
        return new URL(baseUrlString)
    } catch (error) {
        throw Error(`Tried to proxy the domain "${baseUrlString}" which is not a valid url`)
    }
}
