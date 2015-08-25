import React from "react";

import HeaderBar from "../components/HeaderBar";
import NavBar from "../components/NavBar";

class HomePage extends React.Component {

    render(): React.Element {
        return (
            <div className="HomePage">
                <div className="header">
                    <div className="branding-container">
                        <img
                            className="branding-icon"
                            src="/static/askizzy-icon-logotype.svg"
                            alt="Ask Izzy"
                        ></img>
                        <p className="branding-copy">
                            The A to Z directory of homeless help information
                        </p>
                    </div>
                    <HeaderBar
                        primaryText="What do you need?"
                        secondaryText="Select a category or search below"
                    >
                        <form className="search">
                            <input
                                type="search"
                                placeholder="Search; e.g. pets, utility bills"
                            />
                        </form>
                    </HeaderBar>
                </div>

                <div className="body">
                    <NavBar />
                </div>
            </div>
        );
    }

}

export default HomePage;
