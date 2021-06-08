/* @flow */

import * as React from "react";
import Link from "../components/Link";

type Props = {
    setAccessibility: function,
}

function SkipToChoices({ setAccessibility }: Props): React.Node {

    return (
        <div className="skipToSelections">
            <Link to="#"
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
