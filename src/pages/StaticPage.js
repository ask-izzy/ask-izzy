/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import PropTypes from "proptypes";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";

type Props = {
  title: string,
  bannerName: string,
  children: React.Node,
  className: string,
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
        let back = () => this.context.router.goBack();

        return (
            <div className={`StaticPage ${this.props.className}`}>
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
