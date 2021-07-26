/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Link from "./Link";
import * as gtm from "../google-tag-manager";
import iss from "../iss";
import Spacer from "./Spacer";

type Props = {
    object: iss.Service,
}

export default class Feedback extends React.Component<Props, void> {
    recordSuggestChange(): void {
        gtm.emit({
            event: "Service Change Requested",
            eventCat: "Feedback Given",
            eventAction: "Service Change Suggestion",
            eventLabel: location.pathname,
            eventValue: this.props.object.id,
            sendDirectlyToGA: true,
        });
    }

    render(): ReactElement<"div"> {

        return (
            <div className="Feedback">
                <Spacer />
                <h4>Your feedback</h4>
                <p>
                    If information needs updating, or if something is not
                    occurring as expected,&nbsp;
                    <Link
                        className="suggestChange"
                        onClick={this.recordSuggestChange.bind(this)}
                        to={
                            "mailto:support@askizzy.org.au" +
                                "?subject=" +
                                encodeURIComponent(
                                    `Your Ask Izzy feedback: ` +
                                `${this.props.object.id}`) +
                                "&body=" +
                                encodeURIComponent(
                                    `Contact name:

                                    Contact number:

                                    Contact email:

                                    Details of change:

                                    `.replace(/^ +/gm, "")
                                )
                        }
                    >
                        let us know
                    </Link>.
                </p>
            </div>
        );
    }
}
