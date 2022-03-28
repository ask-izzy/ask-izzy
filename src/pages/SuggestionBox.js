/* @flow */

import * as React from "react";

import Link from "../components/base/Link";
import Storage from "../storage";
import Category from "../constants/Category";
import Service from "../iss/Service";
import {ensureURLHasTrailingSlash} from "../utils/url"

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
    const editingPath = () =>
        `${ensureURLHasTrailingSlash(location.pathname)}personalise/summary`

    const clearAnswersExceptForLocation = () => {
        const location = Storage.getJSON("location");
        Storage.clear();
        location && Storage.getJSON("location")
    }

    const navLinks = () => (
        category ?
            <>
                <Link to={editingPath()}>
                    edit your answers
                </Link> or a {
                    <Link
                        to="/"
                        onClick={clearAnswersExceptForLocation}
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
                    onClick={clearAnswersExceptForLocation}
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
