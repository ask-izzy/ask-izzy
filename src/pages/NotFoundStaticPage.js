/* @flow */
/* eslint-disable max-len */

import React from "react";
import AppBar from "../components/AppBar";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";
import history from "../utils/history";

type Props = {}

export default class NotFoundStaticPage extends React.Component<Props, void> {

    render() {
        let back = () => history.back();

        return (
            <div
                className="StaticPage"
            >
                <AppBar
                    title="Page not found"
                    onBackTouchTap={back}
                />
                <HeaderBar
                    primaryText={null}
                    secondaryText={null}
                    bannerName={"drugs-alcohol"}
                    alternateBackgroundColor={false}
                />
                <div className="body">
                    <p>Sorry, but it looks as though the page you are trying to find does not exist. It might be because you followed an old link, or typed the address incorrectly—but it was most likely our fault for moving something.</p>
                    <p>Please contact support at 03 9418 7466 or <a href="mailto:support@askizzy.org.au">support@askizzy.org.au</a>, and we'll try to resolve the problem as soon as we can.</p>
                </div>

                <br/>
                <BrandedFooter/>

            </div>
        );
    }
}
