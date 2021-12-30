/* @flow */

import type {Element as ReactElement, Node as ReactNode} from "React";
import React, {useState} from "react";


import Link from "./base/Link";
import * as gtm from "../google-tag-manager";
import Service from "../iss/Service";
import Spacer from "./Spacer";
import FormReportError from "./feedback/FormReportError"

type Props = {
    object: Service,
}

type State = {
    collapsed: boolean,
}

export default function Feedback(props: Props): ReactNode{

    const [collapsed, setCollapsed] = useState<boolean>(true);

    function recordSuggestChange(): void {
        gtm.emit({
            event: "Service Change Requested",
            eventCat: "Feedback Given",
            eventAction: "Service Change Suggestion",
            eventLabel: location.pathname,
            eventValue: this.props.object.id,
            sendDirectlyToGA: true,
        });
    }

    function toggleFeedback(event: SyntheticEvent<>): void {
        event.preventDefault();
        // rerender component to reset states to create more intuitive component use, this helps 
        // reset the form every time the toggleFeedback link is clicked
        setCollapsed(true);
        setTimeout(() => {setCollapsed(false)}, 0);
    }

    return (
        <div className="Feedback">
                <Spacer />
                <div className="FeedbackInner">
                    <span>Details here incorrect?</span>&nbsp;
                    <a
                        href="#"
                        onClick={toggleFeedback}
                    >
                        Report an error
                    </a>
                    {!collapsed &&
                    <span>
                        <FormReportError />
                    </span>
                    }
                </div>
                <Spacer />
            </div>
    );
}
