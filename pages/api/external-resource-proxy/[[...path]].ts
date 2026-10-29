// We currently can't do with Next.js rewrites due to this bug
// https://github.com/vercel/next.js/issues/37028 stopping us
// proxying the google maps api
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";

import { unflattenDomain } from "@/helpers/url.helpers"

const allowedDomains = new Set(
    (process.env.DOMAINS_TO_PROXY || "").split(",").map(domain => domain.trim()).filter(Boolean)
)

// Providing an error handler replaces http-proxy-middleware's default one so
// as well as logging the error this sends the same response the default
// handler would.
const handleProxyError: Options["onError"] = (err, req, res) => {
    console.error(`Proxy error for target "${getTargetBaseUrl(req).origin}":`, err.message)

    const code = (err as NodeJS.ErrnoException).code
    if (res.writeHead && !res.headersSent) {
        if (/HPE_INVALID/.test(code)) {
            res.writeHead(502)
        } else if (["ECONNRESET", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT"].includes(code)) {
            res.writeHead(504)
        } else {
            res.writeHead(500)
        }
    }
    res.end(`Error occurred while trying to proxy: ${req.headers?.host}${req.url}`)
}

const proxyMiddleware = createProxyMiddleware({
    router: req => getTargetBaseUrl(req).origin,
    changeOrigin: true,
    onError: handleProxyError,
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
