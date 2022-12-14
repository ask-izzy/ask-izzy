import React from "react";

import Book from "@/src/icons/Book";
import Chevron from "@/src/icons/Chevron";
import Link from "@/src/components/base/Link"

export default function DomesticViolenceLinkBar() {
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
