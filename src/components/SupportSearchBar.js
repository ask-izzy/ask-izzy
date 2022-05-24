/* @flow */
import React from "react";
import type {Node as ReactNode} from "React";
import {useRouter} from "next/router"

import SearchBar from "./general/SearchBar";
import ScreenReader from "./ScreenReader";

function SupportSearchBar(): ReactNode {
    const router = useRouter();


    return (
        <div
            role="contentinfo"
            className="content-container"
            aria-labelledby="findOtherServices"
        >
            <ScreenReader>
                <span id="findOtherServices">
                    Find Other Services.
                </span>
            </ScreenReader>
            <div
                className="search-bar-container"
            >
                <p>
                    Don't see what you're looking for?
                </p>
                <SearchBar
                    type="search"
                    placeholder="Search Ask Izzy for a service"
                    onSubmit={(searchText) => {
                        if (searchText) {
                            router.push(
                                `/search/${encodeURIComponent(searchText)}`
                            )
                        }
                    }}
                    autocompleteValues={[]}
                    iconPosition="right"
                />
            </div>
        </div>
    )
}

export default SupportSearchBar;