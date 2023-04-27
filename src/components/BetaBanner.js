/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Link from "@/src/components/base/Link";
import { usersnapFireEvent } from "@/helpers/usersnap.helpers.js"


export default function BetaBanner(): ReactNode {
    const endOfLifeBeta = "XX/XX/2023"
    return (
        <div className="BetaBanner">
            <div className="beta-information-container">
                <div className="beta-welcome-message">
                    <b>
                        Welcome to Ask Izzy beta!
                    </b>
                </div>
                <div className="beta-duration-message">
                    This will run until {endOfLifeBeta}.
                </div>
            </div>
            <div className="beta-relevant-links">
                <Link
                    className="about-beta"
                    to=""
                    onClick={() => usersnapFireEvent("")}
                >
                    About beta
                </Link>
                {" "}|{" "}
                <Link
                    className="exit-beta"
                    to="https://askizzy.org.au/"
                    analyticsEvent={{
                        event: "Action Triggered - Beta Opt Out",
                        eventCat: "Action triggered",
                        eventAction: "Beta Opt Out",
                        eventLabel: null,
                    }}
                >
                    Go back to original site
                </Link>
            </div>

        </div>
    )
}