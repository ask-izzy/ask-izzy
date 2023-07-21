/* @flow */
import { ExtraErrorData } from "@sentry/integrations";

import initSentry from "./sentry.shared.config"

initSentry({
    integrations: [
        new ExtraErrorData(),
    ]
});