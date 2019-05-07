/* @flow */

import React from "react";

import MobileDetect from "./higherorder/MobileDetect";
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
                })
            } catch (e) {
                console.log("There was an error while sharing.");
            }
        }
    }

    render(): React.Element<any> {
        return (
            <React.Fragment>
                <MobileDetect>
                {
                    ({ isMobile }) => {
                        if (!isMobile || navigator.share === undefined) {
                            return
                        }

                        return (
                            <React.Fragment>
                                <Spacer />
                                <div>
                                    <button onClick={this.shareService}>
                                        Share
                                    </button>
                                </div>
                            </React.Fragment>
                        )
                    }
                }
                </MobileDetect>
            </React.Fragment>
        );
    }
}

export default ShareBox;
