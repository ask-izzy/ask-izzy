/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Book from "../icons/book.svg";
import Chevron from "../icons/chevron.svg";
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
                        <Book />
                    </div>
                    <div className="primaryText">
                        Read more about family and domestic violence.
                    </div>
                    <div
                        className="rightIcon"
                        aria-hidden="false"
                    >
                        <Chevron />
                    </div>
                </div>
            </Link>
        );
    }
}
