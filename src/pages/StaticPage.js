/* @flow */
/* eslint-disable max-len */

import React from "react";
import AppBar from "../components/AppBar";
import BrandedFooter from "../components/BrandedFooter";

export default class StaticPage extends React.Component {
    props: {
        title: string,
        children: any,
    };
    state: void;

    // FIXME: https://github.com/facebook/flow/issues/1820
    static defaultProps: {
        children: null,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    render() {
        let back = () => this.context.router.goBack();

        return (
            <div className="StaticPage">
                <AppBar
                    title={this.props.title}
                    onBackTouchTap={back}
                />

                <div className="body">
                    {this.props.children}
                </div>
                <br />
                <BrandedFooter />
            </div>
        );
    }

}
