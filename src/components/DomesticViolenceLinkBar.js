/* @flow */
import * as React from "react";

import icons from "../icons";
import Link from "./base/Link"

export default function DomesticViolenceLinkBar(): React.Node {
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
