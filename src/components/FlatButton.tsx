// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! WARNING: FlatButton is deprecated. Use StandardButton instead. !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import React, {useState} from "react";
import classnames from "classnames";

import Button from "@/src/components/base/Button.js"
import type {AnalyticsEvent} from "../google-tag-manager.js";

type Props = {
    label?: string,
    prompt?: string,
    className?: string,
    onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
    disabled?: boolean,
    children?: any,
    analyticsEvent?: AnalyticsEvent,
} & React.HTMLProps<HTMLButtonElement>

function FlatButton(
    {
        label,
        prompt,
        className,
        onClick,
        disabled,
        children,
        ...rest
    }: Props) {

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
            {...(rest as any)}
        >
            {prompt && showPrompt && <span className="prompt">{prompt}</span>}
            {label}
            {children}
        </Button>
    )
}

export default FlatButton
