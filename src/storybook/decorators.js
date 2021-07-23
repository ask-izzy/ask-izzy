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

export function addRouter(Story: Object): ReactNode {
    return <MemoryRouter><Story/></MemoryRouter>
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
    console.log(env)
    window.STRAPI_URL = env.STRAPI_URL
    return (
        <ApolloProvider
            client={createApolloClient(env.STRAPI_URL)}
        >
            <Story/>
        </ApolloProvider>
    )
}
