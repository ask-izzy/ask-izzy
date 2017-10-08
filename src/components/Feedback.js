/* @flow */

import React from "react";

import iss from "../iss";
import sendEvent from "../google-tag-manager";


export default class Feedback extends React.Component {
    props: {
        object: iss.Service,
    };
    state: void;

    recordSuggestChange(): void {
        sendEvent({
            event: "suggestServiceChange",
            service: this.props.object.id,
        });
    }

    render() {

        return (
            <div className="Feedback">
                <h4>Your feedback</h4>
                <p>If information needs updating, or if something is not
                 occurring as expected,&nbsp;
                    <a
                        className="suggestChange"
                        onClick={this.recordSuggestChange.bind(this)}
                        href={
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
                    </a>.
                </p>
            </div>
        );
    }
}
