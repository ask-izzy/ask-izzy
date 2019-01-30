/* @flow */
/* eslint-disable max-len */

import React from "react";
import PropTypes from "proptypes";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";

type Props = {
    title: string,
    bannerName: string,
    children: any,
    className: string,
    bannerTitle: string,
    bannerSubtitle: string,
}

export default class StaticPage extends React.Component<Props, void> {
    static defaultProps: {
        children: null,
        className: "",
        bannerTitle: "",
        bannerSubtitle: "",
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
            <div className={["StaticPage", this.props.className].join(" ")}>
                <AppBar
                    title={this.props.title}
                    onBackTouchTap={back}
                />
                {
                    this.props.bannerName && (
                        <HeaderBar
                            primaryText={this.props.bannerTitle}
                            secondaryText={this.props.bannerSubtitle}
                            bannerName={this.props.bannerName}
                            alternateBackgroundColor={false}
                        />
                    )
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
