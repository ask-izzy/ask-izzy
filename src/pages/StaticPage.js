/* @flow */
/* eslint-disable max-len */

import React from "react";
import PropTypes from "proptypes";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";

export default class StaticPage extends React.Component<{
    title: string,
    bannerName: string,
    children: any,
}, void> {
    static defaultProps: {
        children: null,
    };

    static sampleProps = {
        title: "Food Banks",
        bannerName: "food",
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    render() {
        let back = () => this.context.router.goBack();

        return (
            <div className="StaticPage">
                <AppBar
                    title={this.props.title}
                    onBackTouchTap={back}
                />
                {
                    this.props.bannerName ?
                        <HeaderBar
                            primaryText={null}
                            secondaryText={null}
                            bannerName={this.props.bannerName}
                            alternateBackgroundColor={false}
                        />
                        : null
                }

                <div className="body">
                    {this.props.children}
                </div>
                <br />
                <BrandedFooter />
            </div>
        );
    }
}
