/* @flow */

import * as React from "react";
import Link from "../components/base/Link";
import Storage from "../storage";
import Category from "../constants/Category";
import {Service} from "../iss";

type Props = {
    category: ?Category,
    searchTerm: string,
    location: Object,
    results: Array<Service>
}

function SuggestionBox(
    {
        category,
        location,
        results,
        searchTerm,
    }: Props): React.Node {

    const trailingSlash = (path: string): string =>
        `${path}${path.endsWith("/") ? "" : "/"}`;

    const editingPath = () =>
        `${trailingSlash(location.pathname)}personalise/summary`

    const clearAnswers = () => {
        const location = Storage.getSearchArea();
        Storage.clear();
        Storage.setSearchArea(location)
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
                <Link
                    to={`/search/${searchTerm}/personalise/page/location`}
                >
                    change your location
                </Link> or a {" "}
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
                    {/*TODO Commented out for now until we work out*/}
                    {/*TODO the search help wording*/}
                    {/*<h4>For more information:</h4>*/}
                    {/*<Link to="/search-help">*/}
                    {/*    Why aren't I seeing more results?*/}
                    {/*</Link>*/}
                </div>
            </div>
        </>
    )

}

export default SuggestionBox
