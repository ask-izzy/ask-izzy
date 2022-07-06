/* @flow */

import type {Element as ReactElement} from "React";
import React, {useState} from "react";
import classnames from "classnames";

import Button from "@/src/components/base/Button"

type Props = {
    label?: string,
    prompt?: string,
    className?: string,
    onClick: Function,
    disabled?: boolean,
    children?: any,
    type?: "primary" | "secondary" | "text" | "action"
}

function StandardButton(
    {
        label,
        prompt,
        className,
        onClick,
        disabled,
        children,
        type = "primary",
        ...rest
    }: Props): ReactElement<typeof Button> {

    // Used to display a prompt to the left of the button when focusing
    // Generally used for the clear button in an input box
    const [showPrompt, setShowPrompt] = useState(false)

    return (
        <Button
            onFocus={() => setShowPrompt(true)}
            onBlur={() => setShowPrompt(false)}
            onClick={onClick}
            disabled={disabled}
            className={classnames("StandardButton", className, `type-${type}`)}
            {...(rest: any)}
        >
            {prompt && showPrompt && <span className="prompt">{prompt}</span>}
            {label}
            {children}
        </Button>
    )

}

export default StandardButton
