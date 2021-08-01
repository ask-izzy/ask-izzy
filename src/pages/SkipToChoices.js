/* @flow */

import * as React from "react";
import Link from "../components/Link";

function SkipToChoices(): React.Node {

    return (
        <div className="skipToSelections">
            <Link
                to="#"
                tabIndex="0"
                aria-label="Skip your previously selected answers
                 and go straight to the options."
                onClick={() => {
                    const selection = document.getElementsByClassName(
                        "ListItem"
                    )
                    if (selection && selection.length) {
                        selection[0].focus();
                    }
                }}
            >
                Skip to make your selection
            </Link>

        </div>
    )
}

export default SkipToChoices
