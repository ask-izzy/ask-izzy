import React from "react";
import Router from "react-router";
import mui from "material-ui";

export default class HeaderBar extends React.Component {

    render(): React.Element {
        return (
            <div className="headerbar-container">
                <div className="branding-container">
                    <img
                        className="branding-icon"
                        src="/static/askizzy-icon-logotype.svg"
                    ></img>
                    <p className="branding-copy">The A to Z directory of homeless help information</p>
                </div>
                <div className="search-container">
                    <div className="search-heading">What do you need?</div>
                    <div className="search-byline">Select a category or search below</div>
                    <div className="headerbar-search">
                        <input type="search" placeholder="Blankets"></input>
                    </div>
                </div>
            </div>
        );
    }

}
