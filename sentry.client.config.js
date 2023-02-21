/* @flow */

import * as Sentry from "@sentry/nextjs";
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const proxyDomainSuffix = process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        dsn: SENTRY_DSN || "null",
        tracesSampleRate: 1.0,
        environment: process.env.ENVIRONMENT || process.env.NODE_ENV,
        integrations: [
            new CaptureConsole({
                levels: ["warn", "error"],
            }),
            new ExtraErrorData(),
            new Sentry.BrowserTracing({
                tracePropagationTargets: [
                    "localhost",
                    /^\//,
                    ...(proxyDomainSuffix ? [proxyDomainSuffix] : []),
                ],
            }),
        ],
    });
}
