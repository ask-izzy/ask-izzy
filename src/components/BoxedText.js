/* @flow */

import type {Element} from "React";
import React from "react";

type Props = {
    children?: any
}

export default class BoxedText extends React.Component<Props, {}> {
    render(): Element<"div"> {
        return (
            <div className="BoxedText">
                <div className="BoxedText-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
