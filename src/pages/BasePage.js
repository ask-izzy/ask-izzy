/* @flow */

import React from "react";
import DocumentTitle from "react-document-title";

export default class BasePage extends React.Component {

    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render(): ReactElement {
        return (
            <div className="BasePage">
                <DocumentTitle title="Ask Izzy" />
                <main>
                    {this.props.main || this.props.children}
                </main>
                {this.props.footer}
            </div>
        );
    }
}
