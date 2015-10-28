/* @flow */

import DocumentTitle from "react-document-title";
import React from "react";
import { Link } from "react-router";

export default class BasePage extends React.Component {

    render(): ReactElement {
        return (
            <div className="BrandedPage">
                <DocumentTitle title="Ask Izzy" />
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
