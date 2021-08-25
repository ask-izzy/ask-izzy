/* @flow */

import * as React from "react";
import PropTypes from "proptypes";
import Link from "./Link";

type Props = {
    icon: React.Element<any>,
    header: string,
    body: string,
    highlightColor: string,
    path: string,
    learnMoreLink?: string,
}

export default class BaseLogoWithTextBox extends React.Component<Props, void> {
    static contextTypes: any = {
        router: PropTypes.object.isRequired,
    };

    onClickBox(): void {
        throw new Error("The onClickBox method should be implemented.");
    }

    render(): React.Node {
        return (
            <div
                className={"LogoWithTextBox"}
                onClick={this.onClickBox.bind(this)}
            >
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
                    <Link
                        to={this.props.path}
                        onClick={(evt) => evt.preventDefault()}
                        aria-label={this.props.learnMoreLink || "Learn More"}
                    >
                        {this.props.learnMoreLink || "Learn More"}
                        <div
                            aria-hidden="true"
                            className={"Chevron"}
                        >
                            &nbsp;&gt;
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}
