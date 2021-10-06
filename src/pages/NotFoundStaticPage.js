/* @flow */
/* eslint-disable max-len */

import React from "react";
import type {Element as ReactElement} from "React";
import HeaderBar from "../components/HeaderBar";
import Link from "../components/base/Link";
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
                    primaryText="Ask Izzy Beta has ended"
                    secondaryText={null}
                    fixedAppBar={false}
                    bannerName={"drugs-alcohol"}
                    showBetaBanner={false}
                />
                <div className="body">
                    <p>Thank you for participating in Ask Izzy Beta! The beta program has now ended but you can <Link to={"mailto:support@askizzy.org.au?subject=Ask%20Izzy%20Beta%20-%20Feedback"}>still leave us feedback</Link>. Otherwise please go to <Link to="https://askizzy.org.au">AskIzzy.org.au</Link> to continue using Ask Izzy.</p>
                </div>

            </div>
        );
    }
}
