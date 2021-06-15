import React from "react";

export default function() {
    const style = {
        position: 'fixed',
        left: 'calc( ( (100vw - 800px) / 2 ) + 800px )',
        width: 'calc( ( (100vw - 800px) / 2 ) - 20px )',
        maxHeight: '100vh',
        overflowY: 'auto',
    }
    return <details style={style}>
        <summary>See colours</summary>
        {colourVars.map(({groupName, vars}) => <div key={groupName}>
            <h3>{groupName}</h3>
            {vars.map(varName => {
                const colour = getComputedStyle(document.documentElement)
                    .getPropertyValue(`--${varName}`)
                console.log(colour)
                return <button key={varName} onClick={() => selectVar(varName)}>
                    <div style={{backgroundColor: colour, height: '1em'}}></div>{varName.replace(/(?:raw-)?colour-/, '')}
                </button>
            })}
        </div>)}
    </details>
}

const colourVars = [
    {
        groupName: 'Raw Colours',
        vars: [
            'raw-colour-rich-purple',
            'raw-colour-plum-purple',
            'raw-colour-bright-red',
            'raw-colour-sunflower',
            'raw-colour-steel-blue',
            'raw-colour-coral-blue',
            'raw-colour-teal',
            'raw-colour-cyan-blue',
            'raw-colour-slate-gray',
            'raw-colour-warm-gray',
            'raw-colour-warm-white',
            'raw-colour-pure-white',
            'raw-colour-pure-black',
        ]
    },
    {
        groupName: 'Features',
        vars: [
            'colour-crisis',
            'colour-input-focus-primary',
            'colour-input-focus-overlay',
            'colour-irreversible-action'
        ]
    },
    {
        groupName: 'Backgrounds',
        vars: [
            'colour-bg-standard',
            'colour-bg-standard-tint-1',
            'colour-bg-standard-tint-2',
            'colour-bg-standard-tint-3',
            'colour-bg-callout-solid',
        ]
    },
    {
        groupName: 'Borders',
        vars: [
            'colour-border-list-item',
            'colour-border-list-item-dark',
            'colour-border-standard-callout',
        ]
    },
    {
        groupName: 'Elements',
        vars: [
            'colour-link',
            'colour-link-visited',
            'colour-button-standard',
            'colour-button-standard-hover',
            'colour-button-disabled',
            'colour-interactive-icon',
        ]
    },
    {
        groupName: 'Text',
        vars: [
            'colour-text-dark',
            'colour-text-mid',
            'colour-text-light',
        ]
    }
]

function selectVar(varName) {
    const root = document.documentElement
    while (root.style.length) {
        console.log('-', root.style, root.style.length, root.style.item(0))
        root.style.removeProperty(root.style.item(0));
    }
    root.style.setProperty(`--${varName}`, "hsl(130, 100%, 54%)");
    root.style.setProperty(`--${varName}-hue`, "130");
    root.style.setProperty(`--${varName}-saturation`, "100%");
}
