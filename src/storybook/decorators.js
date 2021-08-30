/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect} from "react";
import { MemoryRouter } from "react-router-dom";
import {LoadScript} from "@react-google-maps/api";
import { ApolloProvider } from "@apollo/client";

import storage from "../storage";
import RouterContext from "../contexts/router-context";
import { DebugModeProvider } from "../contexts/debug-mode-context";
import createApolloClient from "../utils/apolloClient";
import {browserEventName as gtmBrowserEventName} from "../google-tag-manager"

export function addRouter(Story: Object): ReactNode {
    // Catch link click and stop it firing
    function onClickHandler(event) {
        // Check if target is, or is contained in a link
        if (event.target?.closest("a")) {
            event.preventDefault()
        }
    }
    return <MemoryRouter>
        <div onClick={onClickHandler}>
            <Story/>
        </div>
    </MemoryRouter>
}

export function addGoogleMapsScript(
    Story: Object,
    { loaded: { env } }: Object
): ReactNode {
    if (!env?.GOOGLE_API_KEY) {
        throw new Error("Google API key must be loaded")
    }

    return (
        <LoadScript
            googleMapsApiKey={env.GOOGLE_API_KEY}
            libraries={["places"]}
        >
            <Story/>
        </LoadScript>
    )
}

export function setPersonalisationAnswers(
    Story: Object,
    {parameters}: Object
): ReactNode {
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

export function setRouterContext(
    Story: Object,
    {parameters}: Object
): ReactNode {
    const router = parameters?.context?.router || {}
    return <RouterContext.Provider value={{router}}>
        <Story/>
    </RouterContext.Provider>
}

export function setDebugModeContext(
    Story: Object,
    {parameters}: Object
): ReactNode {
    const debugMode = parameters?.context?.debugMode
    return (
        <DebugModeProvider initialDebugMode={debugMode}>
            <Story/>
        </DebugModeProvider>
    );
}

export function setApolloProvider(Story: Object,
    { loaded: { env } }: Object): ReactNode {
    window.STRAPI_URL = env.STRAPI_URL
    return (
        <ApolloProvider
            client={createApolloClient(env.STRAPI_URL)}
        >
            <Story/>
        </ApolloProvider>
    )
}

// Ideally we'd log to actions but that doesn't seem to deal with CustomEvents
// yet: https://github.com/storybookjs/storybook/issues/14205
export function logGTMEvent(Story: Object): ReactNode {
    function gtmEventHandler(event) {
        console.log("GTM event emitted:", event.detail)
    }
    useEffect(() => {
        // Typecast needed since flow doesn't deal with custom events yet
        // https://github.com/facebook/flow/issues/7179
        (document.querySelector(":root")?.addEventListener: Function)(
            gtmBrowserEventName,
            gtmEventHandler
        )
        return () => {
            (document.querySelector(":root")?.removeEventListener: Function)(
                gtmBrowserEventName,
                gtmEventHandler
            )
        }
    }, [])
    return <Story/>
}
