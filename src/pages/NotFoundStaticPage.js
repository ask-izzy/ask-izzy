/* @flow */
/* eslint-disable max-len */

import React from "react";
import type {Element as ReactElement} from "React";
import HeaderBar from "../components/HeaderBar";
import BrandedFooter from "../components/BrandedFooter";
import Link from "../components/Link";
import routerContext from "../contexts/router-context";

type Props = {}

export default class NotFoundStaticPage extends React.Component<Props, void> {
    static contextType: any = routerContext;

    render(): ReactElement<"div"> {

        return (
            <div
                className="StaticPage"
            >
                <HeaderBar
                    primaryText="Page not found"
                    secondaryText={null}
                    fixedAppBar={false}
                    bannerName={"drugs-alcohol"}
                />
                <div className="body">
                    <p>Sorry, but it looks as though the page you are trying to find does not exist. It might be because you followed an old link, or typed the address incorrectly—but it was most likely our fault for moving something.</p>
                    <p>Please contact support at 03 9418 7466 or <Link to="mailto:support@askizzy.org.au">support@askizzy.org.au</Link>, and we'll try to resolve the problem as soon as we can.</p>
                </div>

                <br/>
                <BrandedFooter/>

            </div>
        );
    }
}
