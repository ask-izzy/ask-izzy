/* @flow */

import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";

getConfig();

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        tracesSampleRate: 1.0,
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
        integrations: [
            new CaptureConsole({
                levels: ["warn", "error"],
            }),
            new ExtraErrorData(),
        ],
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
    });
}
