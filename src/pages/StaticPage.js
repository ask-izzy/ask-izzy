/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";
import routerContext from "../contexts/router-context"

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
        title: "Food Info",
        bannerName: "food",
    };

    static contextType = routerContext;

    render() {

        return (
            <div className={`StaticPage ${this.props.className || ""}`}>
                <AppBar
                    title={this.props.title}
                    onBackTouchTap={() => this.context.router.navigate(-1)}
                />
                {
                    this.props.bannerName ?
                        <HeaderBar
                            primaryText={this.props.bannerPrimary || null}
                            secondaryText={this.props.bannerSecondary || null}
                            bannerName={this.props.bannerName}
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
