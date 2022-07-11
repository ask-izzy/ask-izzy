/* @flow */
import https from "https"
import { bootstrap as bootstrapGlobalAgent } from "global-agent";

import initialiseRequestInterceptor from "@/lib/request-interceptor.js"

if (typeof window !== "undefined") {
    initialiseRequestInterceptor()
} else {
    https.get('https://example.com', res => console.log(1, res.statusCode))
    console.log("******* bootstrapGlobalAgent")
    console.log(bootstrapGlobalAgent())
    console.log(1, global.GLOBAL_AGENT)
    https.get('https://example.com', res => console.log(2, res.statusCode))
    console.log(2, global.GLOBAL_AGENT)
}

