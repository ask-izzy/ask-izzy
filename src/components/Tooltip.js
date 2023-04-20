/* @flow */
import React from "react";
import type {Node as ReactNode} from "react"
import TooltipComponent from "@mui/material/Tooltip";


type TooltipProps = {
    content: ReactNode,
    disableHoverListener?: boolean,
    disableTouchListener?: boolean,
    disableFocusListener?: boolean,
    children: ReactNode
}
export default function Tooltip({
    content,
    children,
    disableHoverListener = false,
    disableTouchListener = false,
    disableFocusListener = true,
    ...otherProps
}: TooltipProps): ReactNode {
    /*
        styling has to be done in css as accessing the
        styles for the MUI tooltip component is too complicated in JS
    */
    return (
        <TooltipComponent
            {...otherProps}
            title={content}
            placement="bottom-start"
            arrow={true}
            disableFocusListener={disableFocusListener}
            disableHoverListener={disableHoverListener}
            disableTouchListener={disableTouchListener}
        >
            {children}
        </TooltipComponent>
    );
}
