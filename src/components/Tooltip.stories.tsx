import React, {ReactNode} from "react";

import TooltipComponent from "@/src/components/Tooltip.js";


export default {
    title: "App Components/ToastMessage",
    component: TooltipComponent,
};

export const Tooltip = (): ReactNode => {
    return <>
        <TooltipComponent
            content = {
                <React.Fragment>
                    This message cannot be edited to stop users with malicious intentions.
                    Please personalise your message using the text boxes on the right.
                </React.Fragment>
            }
        >
            <div
                className="why-cant-i-edit-tooltip"
            >
                Why can&apos;t I edit this message?
            </div>
        </TooltipComponent>
    </>
}
