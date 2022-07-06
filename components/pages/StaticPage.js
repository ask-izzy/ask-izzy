/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import HeaderBar from "@/src/components/HeaderBar";
import BrandedFooter from "@/src/components/BrandedFooter";

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

    render(): React.Element<"div"> {

        return (
            <div className={`StaticPage ${this.props.className || ""}`}>
                <div>
                    <HeaderBar
                        className="prominentHeading"
                        primaryText={this.props.bannerPrimary || this.props.title}
                        secondaryText={this.props.bannerSecondary || null}
                        bannerName={this.props.bannerName || "homepage"}
                    />
                </div>
                <main>
                    <div className="body">
                        {this.props.children}
                    </div>
                    <br />
                </main>
                <BrandedFooter />
            </div>
        );
    }
}
