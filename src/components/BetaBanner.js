/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Button from "@/src/components/base/Button";
import Link from "@/src/components/base/Link";
import { usersnapFireEvent } from "@/helpers/usersnap.helpers.js"


export default function BetaBanner(): ReactNode {
    const endOfLifeBeta = "25 May 2023"
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
                    to="/beta-info"
                >
                    About beta
                </Link>
                {" "}|{" "}
                <Button
                    className="exit-beta"
                    analyticsEvent={{
                        event: "Action Triggered - Beta Opt Out",
                        eventCat: "Action triggered",
                        eventAction: "Beta Opt Out",
                        eventLabel: null,
                    }}
                    onClick={() => usersnapFireEvent("beta-opt-out")}
                >
                    Go back to original site
                </Button>
            </div>

        </div>
    )
}