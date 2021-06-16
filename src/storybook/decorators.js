/* @flow */

import React, {useEffect} from "react";
import { MemoryRouter } from "react-router-dom";
import storage from "../storage";
import RouterContext from "../contexts/router-context";
import {LoadScript} from "@react-google-maps/api";

export function addRouter(Story: Object) {
    return <MemoryRouter><Story/></MemoryRouter>
}

export function addGoogleMapsScript(
    Story: Object,
    { loaded: { env } }: Object
) {
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

export function setRouterContext(
    Story: Object,
    {parameters}: Object
) {
    const router = parameters?.context?.router || {}
    return <RouterContext.Provider value={{router}}>
        <Story/>
    </RouterContext.Provider>
}
