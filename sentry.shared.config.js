import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";
import getConfig from "next/config";

getConfig();

export default ({
    tracesSampleRate: 1.0,
    environment: process.env.ENVIRONMENT || process.env.NODE_ENV,
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
})