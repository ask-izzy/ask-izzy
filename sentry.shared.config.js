/* @flow */
import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';

getConfig();

export default function initSentry(additionalConfig: any = {}) {
    if (process.env.NODE_ENV !== "test") {
        Sentry.init({
            dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
            tracesSampleRate: isNaN(process.env.INTERNAL_SENTRY_TRACES_SAMPLE_RATE) 
                ? 1.0
                : parseFloat(process.env.INTERNAL_SENTRY_TRACES_SAMPLE_RATE),
            environment: process.env.ENVIRONMENT || process.env.NODE_ENV,
            ignoreErrors: [
                /is neither a category or a content page$/,
                /^Fast Refresh had to perform a full reload/,
            ],
            beforeSend(event) {
                if (event.message?.startsWith("[HPM] Error occurred while proxying request")) {
                    event.message = "[HPM] Error occurred while proxying request"
                }
                return event;
            },
            ...additionalConfig
        });
    }

}