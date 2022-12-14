import React, {ReactNode} from "react";
import Tooltip from "@/src/components/Tooltip";

type TooltipProps = {
    content: string,
    children: ReactNode,
}
export default function TooltipHover({
    content,
    children,
    ...otherProps
}: TooltipProps) {
    {
        /*
            styling has to be done in css as accessing the
            styles for the MUI tooltip component is too complicated in JS
        */
    }
    return (
        <div
            className="TooltipHover Tooltip"
        >
            <div>
                <Tooltip
                    {...otherProps}
                    content={<>{content}</>}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "var(--colour-bg-opposite)",
                                fontSize: "14px",
                                fontWeight: "325",
                                "& .MuiTooltip-arrow": {
                                    color: "var(--colour-bg-opposite)",
                                },
                            },
                        },
                    }}
                >
                    <div
                        className="tooltip-children-container"
                    >
                        {children}
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}


