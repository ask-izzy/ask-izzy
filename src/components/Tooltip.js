import React from "react";
import type {Node as ReactNode} from "react"
import TooltipComponent, {tooltipClasses} from "@mui/material/Tooltip";

type TooltipProps = {
    content?: React.Fragment,
    children: ReactNode,
}
export default function Tooltip({content, children}: TooltipProps): ReactNode {
    console.log(tooltipClasses.tooltip)

    return (
        <div className="tooltipContainer">
            {/* styling has to be done in css as accessing the styles for the MUI tooltip component is not possible */}
            <TooltipComponent
                title={content}
                placement="bottom-start"
            >
                {children}
            </TooltipComponent>
        </div>
    );
}

// MuiTooltip-tooltip MuiTooltip-tooltipArrow MuiTooltip-tooltipPlacementBottom css-1k51tf5-MuiTooltip-tooltip


