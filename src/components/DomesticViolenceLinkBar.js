/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import icons from "../icons";
import routerContext from "../contexts/router-context";
import Link from "./base/Link"

export default class DomesticViolenceLinkBar extends React.Component<{}, void> {
    static contextType: any = routerContext;

    render(): ReactElement<typeof Link> {

        return (
            <Link to="/information">
                <div
                    className="DomesticViolenceLinkBar"
                >
                    <div
                        className="leftIcon"
                        aria-hidden="false"
                    >
                        <icons.Book />
                    </div>
                    <div className="primaryText">
                        Read more about family and domestic violence.
                    </div>
                    <div
                        className="rightIcon"
                        aria-hidden="false"
                    >
                        <icons.Chevron />
                    </div>
                </div>
            </Link>
        );
    }
}
