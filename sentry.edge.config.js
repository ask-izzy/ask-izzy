/* @flow */

import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';

import sharedConfig from "./sentry.shared.config"

getConfig();

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        ...sharedConfig,
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
    });
}
