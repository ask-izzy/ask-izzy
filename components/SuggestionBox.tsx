import * as React from "react";

import Link from "@/src/components/base/Link.js";
import Storage from "@/src/storage.js";
import Category from "@/src/constants/Category.js";
import Service from "@/src/iss/Service.js";
import {ensureURLHasTrailingSlash} from "@/src/utils/url.js"

type Props = {
    category: Category | null,
    searchTerm: string,
    pathname: string,
    results: Array<Service>
}

function SuggestionBox(
    {
        category,
        pathname,
        results,
        searchTerm,
    }: Props) {
    const editingPath = () =>
        `${ensureURLHasTrailingSlash(pathname)}personalise/summary`

    const clearAnswers = () => {
        const location = Storage.getSearchArea();
        const myList = Storage.getJSON("my-list-services");
        Storage.clear();
        Storage.setJSON("my-list-services", myList)
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
