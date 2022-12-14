import React, {ReactNode, ReactElement} from "react";
import TooltipComponent from "@mui/material/Tooltip";

type TooltipProps = {
    content: ReactNode,
    disableHoverListener?: boolean,
    disableTouchListener?: boolean,
    disableFocusListener?: boolean,
    children: ReactElement
    componentsProps?: Record<any, any>,
    open?: boolean,
}
export default function Tooltip({
    content,
    children,
    disableHoverListener = false,
    disableTouchListener = false,
    disableFocusListener = true,
    ...otherProps
}: TooltipProps) {
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
            children={children}
        />
    );
}
