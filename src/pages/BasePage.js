/* @flow */

import React from "react";

export default class BasePage extends React.Component {

    // flow:disable
    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render(): ReactElement {
        return (
            <div className="BasePage">
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
