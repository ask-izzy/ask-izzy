/* @flow */
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! WARNING: FlatButton is deprecated. Use StandardButton instead. !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import type {Element as ReactElement} from "React";
import React, {useState} from "react";
import classnames from "classnames";

import Button from "./base/Button"

type Props = {
    label?: string,
    prompt?: string,
    className?: string,
    onClick: Function,
    disabled?: boolean,
    children?: any,
}

function FlatButton(
    {
        label,
        prompt,
        className,
        onClick,
        disabled,
        children,
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
            className={classnames("FlatButton", className)}
            {...(rest: any)}
        >
            {prompt && showPrompt && <span className="prompt">{prompt}</span>}
            {label}
            {children}
        </Button>
    )

}

export default FlatButton
