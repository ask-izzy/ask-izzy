/* @flow */

import React from "react";

import sendEvent from "../google-tag-manager";
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
        sendEvent({
            event: "suggestServiceChange",
            service: this.props.object.id,
        });
    }

    toggleFeedback = (event: SyntheticEvent<>): void => {
        event.preventDefault();
        this.setState(prevState => ({
            collapsed: !prevState.collapsed,
        }));
    }

    render() {
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
