/* @flow */

import * as React from "react";
import Link from "../components/Link";
import Storage from "../storage";

type Props = {
    location: Object
}

function SuggestionBox({location}: Props): React.Node {

    const trailingSlash = (path: string): string =>
        `${path}${path.endsWith("/") ? "" : "/"}`;

    const editingPath = () =>
        `${trailingSlash(location.pathname)}personalise/summary`

    const clearAnswers = () => {
        const location = Storage.getLocation();
        Storage.clear();
        Storage.setLocation(location)
    }

    return (
        <>
            <div className="SuggestionBox">
                <div className="SuggestionContentBox">
                    <h3>Want to see more services?</h3>
                    <div>
                        Try <Link to={editingPath()}>
                            edit you answers
                        </Link> or a {
                            <Link
                                to="/"
                                onClick={clearAnswers}
                            >
                            new search
                            </Link>
                        }
                    </div>
                    <h4>For more information:</h4>
                    <Link to="/search-help">
                        Why aren't I seeing more results?
                    </Link>
                </div>
            </div>
        </>
    )

}

export default SuggestionBox
