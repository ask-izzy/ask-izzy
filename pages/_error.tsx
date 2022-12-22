// This page is heavily based off: https://github.com/vercel/next.js/blob/dba9e2a12adeb2066d0d5bb9a49bdb3e29689b92/examples/with-sentry/pages/_error.js

import React from "react"

import * as Sentry from "@sentry/nextjs"
import NextErrorComponent from "next/error"

const CustomErrorComponent = (props) => (
    <NextErrorComponent statusCode={props.statusCode} />
)

CustomErrorComponent.getInitialProps = async(contextData) => {
    // In case this is running in a serverless function, await this in order to give Sentry
    // time to send the error before the lambda exits
    await Sentry.captureUnderscoreErrorException(contextData)

    // This will contain the status code of the response
    return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
