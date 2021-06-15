/* @flow */

import * as React from "react";
import Link from "../components/Link";
import Storage from "../storage";
import Category from "../constants/Category";
import {Service} from "../iss";

type Props = {
    category: ?Category,
    location: Object,
    results: Array<Service>
}

function SuggestionBox({category, location, results}: Props): React.Node {

    const trailingSlash = (path: string): string =>
        `${path}${path.endsWith("/") ? "" : "/"}`;

    const editingPath = () =>
        `${trailingSlash(location.pathname)}personalise/summary`

    const clearAnswers = () => {
        const location = Storage.getLocation();
        Storage.clear();
        Storage.setLocation(location)
    }

    const navLinks = () => (
        category ?
            <>
                <Link to={editingPath()}>
                    edit your answers
                </Link> or a {
                    <Link
                        to="/"
                        onClick={clearAnswers}
                    >
                    new search
                    </Link>
                }
            </> : <>
                a {" "}
                <Link
                    to="/"
                    onClick={clearAnswers}
                >
                    new search
                </Link>
            </>
    )

    return (
        <>
            <div className={`SuggestionBox ${
                results.length ? "withBackground"
                    : "withoutBackground"}`}
            >
                <div className="SuggestionContentBox">
                    <h3>Want to see more services?</h3>
                    <div>
                        Try {navLinks()}
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
