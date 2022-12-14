import { bootstrap as bootstrapGlobalAgent } from "global-agent";

import initialiseRequestInterceptor from "@/lib/request-interceptor.js"

if (typeof window !== "undefined") {
    initialiseRequestInterceptor()
} else {
    bootstrapGlobalAgent()
}

