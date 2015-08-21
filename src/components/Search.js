/* @flow */
import React from "react";
import SearchIcon from "../icons/Search";

class Search extends React.Component {

    render(): React.Element {
        return (
            <div className="search-container">
            <div className="search">
                <input type="search"
                    name="search"
                    placeholder="Search"
                    id="search-box"
                >
                </input>
                <SearchIcon />
            </div>
            </div>
        );
    }

}

export default Search;
