/* @flow */

import * as React from "react";
import PropTypes from "proptypes";

import Link from "./Link";
import * as gtm from "../google-tag-manager";

type Props = {
    icon: React.Element<any>,
    header: string,
    body: string,
    highlightColor: string,
    path: string,
}

export default class BaseLogoWithTextBox extends React.Component<Props, void> {
    render(): React.Node {
        return (
            <Link
                to={this.props.path}
                onClick={this.onClickHandler.bind(this)}
                className={"LogoWithTextBox"}
            >
                <div className="container">
                    <div className={"Icon"}>
                        <div
                            className={"IconBorder"}
                            style={{
                                backgroundColor: this.props.highlightColor,
                            }}
                        >
                            { this.props.icon }
                        </div>
                    </div>
                    <div className={"Content"}>
                        <div className={"Header"}>
                            { this.props.header }
                        </div>
                        <div className={"Instruction"}>
                            { this.props.body }
                        </div>
                    </div>
                    <div className={"linked-text"}>
                        Learn More
                        <span
                            className={"Chevron"}
                            style={{
                                color: this.props.highlightColor,
                            }}
                        >
                            &nbsp;&gt;
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    onClickHandler() {
        gtm.emit({
            event: `Banner Clicked - "${this.props.header}"`,
            eventCat: "Banner Clicked",
            eventAction: this.props.header,
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });
    }
}
