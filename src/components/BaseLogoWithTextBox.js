/* @flow */

import * as React from "react";
import PropTypes from "proptypes";

type Props = {
    icon: React.Element<any>,
    header: string,
    body: string,
    highlightColor: string,
    classes: Array<string>,
}

export default class BaseLogoWithTextBox extends React.Component<Props, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    static defaultProps = {
        classes: [],
    }

    onClickBox(): void {
        throw new Error("The onClickBox method should be implemented.");
    }

    render(): React.Node {
        return (
            <div
                className={
                    ["LogoWithTextBox", ...this.props.classes].join(" ")
                }
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
                    <div className={"Link"}>
                        Learn More
                        <div
                            className={"Chevron"}
                            style={{
                                color: this.props.highlightColor,
                            }}
                        >
                            &nbsp;&gt;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
