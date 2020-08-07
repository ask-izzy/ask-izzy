/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import PropTypes from "proptypes";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";
import history from "../utils/history";

type Props = {
  title: string,
  bannerName: string,
  children: React.Node,
  className: string,
  bannerPrimary?: string,
  bannerSecondary?: string,
}

export default class StaticPage extends React.Component<Props> {
    static defaultProps: {
        children: null,
        className: "",
    };

    static sampleProps = {
        title: "Food Banks",
        bannerName: "food",
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    render() {
        let back = () => history.back();

        return (
            <div className={`StaticPage ${this.props.className}`}>
                <AppBar
                    title={this.props.title}
                    onBackTouchTap={back}
                />
                {
                    this.props.bannerName ?
                        <HeaderBar
                            primaryText={this.props.bannerPrimary || null}
                            secondaryText={this.props.bannerSecondary || null}
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
