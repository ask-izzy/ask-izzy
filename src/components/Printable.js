/* @flow */
import React from "react";

export default class Printable extends React.Component {

    static propTypes = {
        print: React.PropTypes.node,
        screen: React.PropTypes.node,
    };

    render(): ReactElement {
        return (
            <div className="Printable">
                <div className="ScreenOnly">{this.props.screen}</div>
                <div className="PrintOnly">{this.props.print}</div>
            </div>
        );
    }
}
