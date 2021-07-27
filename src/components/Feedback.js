/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Link from "./base/Link";
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
                <p>
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
                        Email us with feedback or changes
                    </Link> to service information if details here
                     need updating.
                </p>
            </div>
        );
    }
}
