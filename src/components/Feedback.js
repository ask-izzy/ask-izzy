/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import * as gtm from "../google-tag-manager";
import iss from "../iss";
import Spacer from "./Spacer";
import FormReportError from "./feedback/FormReportError"

type Props = {
    object: iss.Service,
}

type State = {
    collapsed: boolean,
}

export default class Feedback extends React.Component<Props, State> {

    state = {
        collapsed: true,
    }

    recordSuggestChange(): void {
        gtm.emit({
            event: "Service Change Requested",
            eventCat: "Feedback Given",
            eventAction: "Service Change Suggestion",
            eventLabel: location.pathname,
            eventValue: this.props.object.id,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");
    }

    toggleFeedback = (event: SyntheticEvent<>): void => {
        event.preventDefault();
        this.setState(prevState => ({
            collapsed: !prevState.collapsed,
        }));
    }

    render(): ReactElement<"div"> {
        const {collapsed} = this.state

        return (
            <div className="Feedback">
                <Spacer />
                <div className="FeedbackInner">
                    <span>Details here incorrect?</span>&nbsp;
                    <a
                        href="#"
                        onClick={this.toggleFeedback}
                    >
                        Report an error
                    </a>
                    {!collapsed &&
                    <div className="inline">
                        <FormReportError />
                    </div>
                    }
                </div>
                <Spacer />
            </div>
        );
    }
}
