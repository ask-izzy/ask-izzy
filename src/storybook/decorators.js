/* @flow */

import React, {useEffect} from "react";
import { MemoryRouter } from "react-router";
import { withScriptjs } from "react-google-maps";
import storage from "../storage";
import RouterContext from "../contexts/router-context";

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
    const googleMapURL = `https://maps.googleapis.com/` +
        `maps/api/js?v=3.25&key=${env.GOOGLE_API_KEY}` +
        `&libraries=places`

    const StoryWithGoogleMapsScript = withScriptjs(() => <Story/>);

    return (
        <StoryWithGoogleMapsScript
            googleMapURL={googleMapURL}
            loadingElement={<div style={{ height: `100%` }} />}
        />
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
