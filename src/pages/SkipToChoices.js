/* @flow */

import * as React from "react";
import Link from "../components/Link";

type Props = {
    setAccessibility: function,
    tabIndex: number,
}

function SkipToChoices({ setAccessibility, tabIndex }: Props): React.Node {

    return (
        <div className="skipToSelections">
            <Link
                to="#"
                tabIndex={tabIndex}
                onClick={() => {
                    const selection = document.getElementsByClassName(
                        "ListItem"
                    )
                    if (selection && selection.length) {
                        selection[0].focus();
                        setAccessibility(false)
                    }
                }}
            >
                Skip to make your selection
            </Link>

        </div>
    )
}

export default SkipToChoices
