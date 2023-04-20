/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import TooltipComponent from "./Tooltip";


export default {
    title: "App Components/ToastMessage",
    component: TooltipComponent,
};

export const Tooltip = (args: Object): ReactNode => {
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
                This is a tooltip
            </div>
        </TooltipComponent>
    </>
}
