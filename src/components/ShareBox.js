/* @flow */

import * as React from "react";

import Spacer from "./Spacer";

import type { Service } from "../iss";

type Props = {
    object: Service
}

class ShareBox extends React.Component<Props> {
    shareService = async () => {
        if (navigator.share !== undefined) {
            try {
                await navigator.share({
                    title: this.props.object.name,
                    url: window.location.href,
                    text: `This service might be useful for you: ${this.props.object.name}`,
                })
            } catch (e) {
                console.log("There was an error while sharing.");
            }
        }
    }

    render(): React.Element<any> {
        return (
            <React.Fragment>
                {
                    navigator.share !== undefined && (
                        <React.Fragment>
                            <Spacer />
                            <div class="Contact">
                                <button
                                    className="ContactButton"
                                    onClick={this.shareService}
                                >
                                    <div
                                        className="Contact-text"
                                    >
                                        Share this service
                                    </div>
                                </button>
                            </div>
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}

export default ShareBox;
