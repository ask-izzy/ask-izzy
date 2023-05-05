/* @flow */
// We currently can't do with Next.js rewrites due to this bug
// https://github.com/vercel/next.js/issues/37028 stopping us
// proxying the google maps api
import { createProxyMiddleware } from "http-proxy-middleware";
import { lsof } from "list-open-files"

import { unflattenDomain } from "@/helpers/url.helpers"

const allowedDomains = new Set(process.env.DOMAINS_TO_PROXY)

const proxyMiddleware = createProxyMiddleware({
    router: req => getTargetBaseUrl(req).origin,
    changeOrigin: true,
});

export default function handler(req: any, res: any): void {
    if (!process.env.DOMAINS_TO_PROXY) {
        return res.status(400).send("Route not available");
    }

    setTimeout(async() => {
        const processInfos = await lsof()

        const files = processInfos[0]?.files
        if (!files) {
            return
        }
        const sockets = files.filter(file => (file.type === "IP") && file.from)
        const incomingSockets = sockets.filter(socket => socket.from.port === 8000)
        const outgoingSockets = sockets.filter(socket => socket.from.port !== 8000)

        console.log(
            `${files.length} open fd, ${incomingSockets.length} incoming sockets, ${outgoingSockets.length} outgoing`
        )
    }, 1000)

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
