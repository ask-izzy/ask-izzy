/* @flow */

import React from "react";
import DocumentTitle from "react-document-title";
import { makeTitle } from "../routes";

export default class BasePage extends React.Component {

    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render(): ReactElement {
        return (
            <div className="BasePage">
                <DocumentTitle
                    title={makeTitle(
                        this.props.routes,
                        this.props.params
                    )}
                />
                <main>
                    {this.props.main || this.props.children}
                </main>
                {this.props.footer}
            </div>
        );
    }
}
