import React, {ReactNode} from "react";

import TooltipHover from "@/src/components/TooltipHover.js";


export default {
    title: "App Components/ToastMessage",
    component: TooltipHover,
};

export const Tooltip = (args: Object): ReactNode => {
    return <>
        <TooltipHover
            content = {
                `This message cannot be edited to stop users with malicious intentions.
                    Please personalise your message using the text boxes on the right.`
            }
        >
            <div
                className="why-cant-i-edit-tooltip"
            >
                This is a tooltip
            </div>
        </TooltipHover>
    </>
}
