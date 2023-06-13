import React from "react";
import {useRouter} from "next/router"

import SearchBar from "@/src/components/general/SearchBar.js";
import ScreenReader from "@/src/components/ScreenReader.js";

function SupportSearchBar() {
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
                    Don&apos;t see what you&apos;re looking for?
                </p>
                <SearchBar
                    placeholder="Search Ask Izzy for a service"
                    onSubmit={(searchText) => {
                        if (searchText) {
                            router.push(
                                `/search/${encodeURIComponent(searchText)}`,
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