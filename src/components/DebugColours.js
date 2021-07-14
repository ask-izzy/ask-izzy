/* $FlowIgnore */

import React from "react";

import {useDebugModeContext} from "../contexts/debug-mode-context";

export default function() {
    const [debugMode] = useDebugModeContext()
    if (typeof window === "undefined" || !debugMode) {
        return null;
    }

    // Unselect colours every re-render so we got to sample all the colours
    // to determine what colour the buttons should be we don't accidentally
    // paint it the selection colour.
    unselectVar()

    const style = {
        position: "fixed",
        left: "calc( ( (100vw - 800px) / 2 ) + 800px )",
        width: "calc( ( (100vw - 800px) / 2 ) - 20px )",
        maxHeight: "100vh",
        overflowY: "auto",
    }
    return <details style={style}>
        <summary>See colours</summary>
        {colourVars.map(({groupName, vars}) => <div key={groupName}>
            <h3>{groupName}</h3>
            {vars.map(varName => {
                const colour = getComputedStyle(document.documentElement)
                    .getPropertyValue(`--${varName}`)
                return (
                    <button key={varName}
                        onClick={() => selectVar(varName)}
                    >
                        <div style={{backgroundColor: colour, height: "1em"}} />
                        {varName.replace(/(?:raw-)?colour-/, "")}
                    </button>
                )
            })}
        </div>)}
    </details>
}

const colourVars = [
    {
        groupName: "Raw Colours",
        vars: [
            "raw-colour-rich-purple",
            "raw-colour-plum-purple",
            "raw-colour-bright-red",
            "raw-colour-sunflower",
            "raw-colour-steel-blue",
            "raw-colour-coral-blue",
            "raw-colour-teal",
            "raw-colour-cyan-blue",
            "raw-colour-slate-gray",
            "raw-colour-warm-gray",
            "raw-colour-warm-white",
            "raw-colour-pure-white",
            "raw-colour-pure-black",
        ],
    },
    {
        groupName: "Features",
        vars: [
            "colour-crisis",
            "colour-input-focus-primary",
            "colour-input-focus-overlay",
            "colour-irreversible-action",
        ],
    },
    {
        groupName: "Backgrounds",
        vars: [
            "colour-bg-standard",
            "colour-bg-standard-tint-1",
            "colour-bg-standard-tint-2",
            "colour-bg-standard-tint-3",
            "colour-bg-callout-solid",
        ],
    },
    {
        groupName: "Borders",
        vars: [
            "colour-border-list-item",
            "colour-border-list-item-dark",
            "colour-border-standard-callout",
        ],
    },
    {
        groupName: "Elements",
        vars: [
            "colour-link",
            "colour-link-visited",
            "colour-button-standard",
            "colour-button-standard-hover",
            "colour-button-disabled",
            "colour-interactive-icon",
        ],
    },
    {
        groupName: "Text",
        vars: [
            "colour-text-dark",
            "colour-text-mid",
            "colour-text-light",
            "colour-text-very-light",
        ],
    },
]

function selectVar(varName) {
    unselectVar()
    const root = document.documentElement
    root.style.setProperty(`--${varName}`, "hsl(130, 100%, 54%)");
    root.style.setProperty(`--${varName}-hue`, "130");
    root.style.setProperty(`--${varName}-saturation`, "100%");
}

function unselectVar() {
    const root = document.documentElement
    while (root.style.length) {
        root.style.removeProperty(root.style.item(0));
    }
}
