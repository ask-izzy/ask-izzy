/* $FlowIgnore */

import React, {useState, useEffect} from "react";
import convert from "color-convert";
import {useDebugModeContext} from "../contexts/debug-mode-context";

export default function() {
    const [debugMode] = useDebugModeContext()

    const [colourVarsOriginals, setColourVarsOriginals] = useState({})
    const [colourVarsOverrides, setColourVarsOverrides] = useState({})

    const [fillColour, setFillColour] = useState("#14ff3b")

    useEffect(() => {
        const newColourVarsOriginals = {}
        for (const colourGroup of colourVars) {
            newColourVarsOriginals[colourGroup.groupName] = {}
            for (const varName of colourGroup.vars) {
                const colour = getComputedStyle(document.documentElement)
                    .getPropertyValue(`--${varName}`)
                newColourVarsOriginals[colourGroup.groupName][varName] = colour
            }
        }
        setColourVarsOriginals(newColourVarsOriginals)
    }, [])

    if (typeof window === "undefined" || !debugMode) {
        return null;
    }

    // Unselect colours every re-render so we got to sample all the colours
    // to determine what colour the buttons should be we don't accidentally
    // paint it the selection colour.
    setColourOverrides()

    function overrideColour(varName, groupName, hexColour) {
        const colourVarsGroupOverrides = colourVarsOverrides[groupName] || {}
        colourVarsGroupOverrides[varName] = hexColour
        setColourVarsOverrides({
            ...colourVarsOverrides,
            [groupName]: colourVarsGroupOverrides,
        })
    }
    function removeOverrideColour(varName, groupName) {
        const colourVarsGroupOverrides = colourVarsOverrides[groupName] || {}
        delete colourVarsGroupOverrides[varName]
        setColourVarsOverrides({
            ...colourVarsOverrides,
            [groupName]: colourVarsGroupOverrides,
        })
    }

    function setColourOverrides() {
        const root = document.documentElement
        unsetColourOverrides()
        for (const groupName in colourVarsOverrides) {
            for (const varName in colourVarsOverrides[groupName]) {
                const overrideColourHex =
                    colourVarsOverrides[groupName][varName]
                const hslColour = convert.hex.hsl(overrideColourHex)
                root.style.setProperty(
                    `--${varName}`,
                    `hsl(${hslColour[0]}, ${hslColour[1]}%, ${hslColour[2]}%)`
                );
                root.style.setProperty(`--${varName}-hue`, `${hslColour[0]}`);
                root.style.setProperty(
                    `--${varName}-saturation`,
                    `${hslColour[1]}%`
                );

            }
        }
    }

    function unsetColourOverrides() {
        const root = document.documentElement
        while (root.style.length) {
            root.style.removeProperty(root.style.item(0));
        }
    }

    const style = {
        position: "fixed",
        left: "calc( ( (100vw - 800px) / 2 ) + 800px )",
        width: "calc( ( (100vw - 800px) / 2 ) - 20px )",
        maxHeight: "100vh",
        overflowY: "auto",
    }
    return <details style={style}>
        <summary>See colours</summary>
        Replacement colour:
        <input
            type="color"
            value={fillColour}
            onChange={event => setFillColour(event.target.value)}
        />
        {colourVars.map(({groupName, vars}) => <div key={groupName}>
            <h3 style={{marginBottom: "0"}}>{groupName}</h3>
            {vars.map(varName => {
                const colourOriginal =
                    colourVarsOriginals?.[groupName]?.[varName]
                const colourOverride =
                    colourVarsOverrides?.[groupName]?.[varName]
                return (
                    <button
                        key={varName}
                        onClick={
                            () => overrideColour(varName, groupName, fillColour)
                        }
                    >
                        <div style={{display: "flex"}}>
                            <div
                                style={{
                                    backgroundColor: colourOriginal,
                                    height: "1em",
                                    flex: 1,
                                }}
                            />
                            {colourOverride &&
                            <div
                                style={{
                                    backgroundColor: colourOverride,
                                    height: "1em",
                                    lineHeight: "1em",
                                    alignText: "center",
                                    flex: 1,
                                }}
                                onClick={event => {
                                    removeOverrideColour(varName, groupName)
                                    event.stopPropagation()
                                }}
                            >
                                x
                            </div>
                            }
                        </div>
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
        groupName: "Brand Palette",
        vars: [
            "colour-brand-primary",
        ],
    },
    {
        groupName: "Features",
        vars: [
            "colour-crisis",
            "colour-input-focus-primary",
            "colour-input-focus-overlay",
            "colour-irreversible-action",
            "colour-element-shadow",
            "app-bar-shadow",
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
            "colour-bg-code",
            "colour-bg-highlight",
        ],
    },
    {
        groupName: "Borders",
        vars: [
            "colour-border-list-item",
            "colour-border-list-item-dark",
            "colour-border-standard-callout",
            "colour-border-alert",
        ],
    },
    {
        groupName: "Elements",
        vars: [
            "colour-link",
            "colour-link-visited",
            "colour-button-primary",
            "colour-button-primary-hover",
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
