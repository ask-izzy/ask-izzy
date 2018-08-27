/* @flow */

import React from "react";
import PropTypes from "proptypes";
import icons from "../icons";

export default class OnlineSafetyLink extends React.Component {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    // TODO: change to the suitable icon for Online Safety Link
    render() {
        return (
            <div
                className={"OnlineSafetyLink"}
                onClick={this.onClickOnlineSafetyLink.bind(this)}
            >
                <div className={"Icon"}>
                    <div className={"IconBorder"}>
                        <icons.OnLineSecurity className={"big middle"}/>
                    </div>
                </div>
                <div className={"Content"}>
                    <div className={"Header"}>
                        Online Safety
                    </div>
                    <div className={"Instruction"}>
                        There are some simple steps you can take
                        which will make you safer online.
                    </div>
                    <div className={"Link"}>
                        Learn More
                        <div className={"Chevron"}> ></div>
                    </div>
                </div>
            </div>
        )
    }

    onClickOnlineSafetyLink() {
        let path = "/online-safety";

        this.context.router.push(
            path,
        );
    }


}
