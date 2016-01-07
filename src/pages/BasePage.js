/* @flow */

import React from "react";
import _ from "underscore";
import DocumentTitle from "react-document-title";
import { History } from "react-router";
import reactMixin from "react-mixin";
import { makeTitle } from "../routes";

/*::`*/@reactMixin.decorate(History)/*::`;*/
export default class BasePage extends React.Component {

    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render(): ReactElement {
        const title = _.chain(this.props.routes)
            .pluck("title")
            .compact()
            .last()
            .value();

        return (
            <div className="BasePage">
                <DocumentTitle
                    title={makeTitle(
                        title,
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
