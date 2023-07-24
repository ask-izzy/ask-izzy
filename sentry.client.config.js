/* @flow */

import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";

import initSentry from "./sentry.shared.config"

initSentry({
    integrations: [
        new CaptureConsole({
            levels: ["warn", "error"],
        }),
        new ExtraErrorData(),
    ],
});
