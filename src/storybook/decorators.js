/* eslint-disable no-unsafe-optional-chaining */
import React, {useEffect} from "react";
import {LoadScript} from "@react-google-maps/api";
import { ApolloProvider } from "@apollo/client";

import storage from "@/src/storage.js";
import { DebugModeProvider } from "@/contexts/debug-mode-context.js";
import createApolloClient from "@/src/utils/apolloClient.js";
import {browserEventName as gtmBrowserEventName} from "@/src/google-tag-manager.js"


export function addGoogleMapsScript(
    Story,
    {loaded: {env}}
) {
    if (!env?.NEXT_PUBLIC_GOOGLE_API_KEY) {
        throw new Error("Google API key must be loaded")
    }

    return (
        <LoadScript
            googleMapsApiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
            libraries={["places"]}
        >
            <Story/>
        </LoadScript>
    )
}

export function setPersonalisationAnswers(
    Story,
    {parameters}
) {
    const answers = parameters?.context?.personalisationAnswers || {}
    setAnswers(answers)
    useEffect(() => () => clearAnswers(answers))
    return <Story/>

    function setAnswers(answers) {
        for (const [key, answer] of Object.entries(answers)) {
            const stringifiedAnswer = typeof answer === "string" ?
                answer
                : JSON.stringify(answer) || ""
            storage.setItem(key, stringifiedAnswer)
        }
    }

    function clearAnswers(answers) {
        for (const key of Object.keys(answers)) {
            storage.removeItem(key)
        }
    }
}

export function setDebugModeContext(
    Story,
    {parameters}
) {
    const debugMode = parameters?.context?.debugMode
    return (
        <DebugModeProvider initialDebugMode={debugMode}>
            <Story/>
        </DebugModeProvider>
    );
}

export function setApolloProvider(Story,
    { loaded: { env } }) {
    window.NEXT_PUBLIC_STRAPI_URL = env.NEXT_PUBLIC_STRAPI_URL
    return (
        <ApolloProvider
            client={createApolloClient(env.NEXT_PUBLIC_STRAPI_URL)}
        >
            <Story/>
        </ApolloProvider>
    )
}

// Ideally we'd log to actions but that doesn't seem to deal with CustomEvents
// yet: https://github.com/storybookjs/storybook/issues/14205
export function logGTMEvent(Story) {
    function gtmEventHandler(event) {
        console.log("GTM event emitted:", event.detail)
    }
    useEffect(() => {
        (document.querySelector(":root")?.addEventListener)(
            gtmBrowserEventName,
            gtmEventHandler
        )
        return () => {
            (document.querySelector(":root")?.removeEventListener)(
                gtmBrowserEventName,
                gtmEventHandler
            )
        }
    }, [])
    return <Story/>
}
