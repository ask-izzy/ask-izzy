/* @flow */
// We currently can't do with Next.js rewrites due to this bug
// https://github.com/vercel/next.js/issues/37028 stopping us
// proxying the google maps api
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";

const proxyMiddleware = createProxyMiddleware({
    router: req => req.query.origin,
    changeOrigin: true,
    pathRewrite: function(path, req) {
        // Annoyingly Next.js can either be set to rewrite all urls to have trailing slashs or to not have trailing
        //slashes. (See <https://github.com/vercel/next.js/issues/15148>.) Generally we want our site routes to
        // redirects to without trailing slashes but if we're using this proxy route to a domain that requires trailing
        // slashes then we have to account for the fact that Next.js will have stripped them away by the time the
        // request reaches us and manually reinsert it.
        if (req.query.origin.endsWith("iss3.docker.dev")) {
            return path.replace(
                /^\/api\/external-resource-proxy\/https%3A%2F%2Fiss3\.docker\.dev\/([^?]*)(\??.*)/,
                "/$1/$2"
            )
        }
        return path.replace(/^\/api\/external-resource-proxy\/[^/]+\//, "/")
    },
    onProxyRes: responseInterceptor(async(responseBuffer, proxyRes, req, res) => {
        console.log("got resssss")
        const hasPrefix = res.getHeader("location")?.startsWith("/api/external-resource-proxy/")
        if (!hasPrefix) {
            res.setHeader(
                "location",
                `/api/external-resource-proxy/${encodeURIComponent(req.query.origin)}${res.getHeader("location")}`
            );
        }
    }),
});

export default function handler(req: any, res: any): void {
    if (!process.env.NEXT_PUBLIC_SERVER_PROXY) {
        return res.status(400).send("Route not available");
    }
    proxyMiddleware(req, res, (result: any) => {
        console.log("got ressss2")
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
