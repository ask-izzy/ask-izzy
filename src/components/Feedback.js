/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Link from "./base/Link";
import * as gtm from "../google-tag-manager";
import Service from "../iss/Service";
import Spacer from "./Spacer";

type Props = {
    object: Service,
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
                    Email us at{" "}
                    <Link
                        className="suggestChange"
                        onClick={this.recordSuggestChange.bind(this)}
                        to={
                            `mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}` +
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
                        {process.env.NEXT_PUBLIC_SITE_EMAIL}
                    </Link> with feedback or changes to service information
                    if details here need updating.
                </p>
            </div>
        );
    }
}
