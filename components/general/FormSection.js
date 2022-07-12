/* @Flow */
import React from "react"

export default function FormSection({title, className, children}) {
    return (
        <fieldset className={"FormSection " + className}>
            <legend>{title}</legend>
            {children}
        </fieldset>
    )
}
