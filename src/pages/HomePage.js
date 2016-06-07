/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import NavBar from "../components/NavBar";
import icons from "../icons";
import storage from "../storage";

class HomePage extends React.Component {
    props: {};
    state: void;

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    componentDidMount(): void {
        // Make mobile browser hide the app bar
        window.scrollTo(0, 1);
    }

    onSearchSubmit(event: Event): void {
        event.preventDefault();

        const search = this.refs.search.value;

        if (search == "") {
            /* FIXME: should this give some user feedback? */
            return;
        }

        storage.setSearch(search);

        this.context.router.push(
            `/search/${encodeURIComponent(search)}`
        );
    }

    render() {
        return (
            <div className="HomePage">
                <div className="header">
                    <div className="branding-container">
                        <div className="logo">
                            <icons.Logotype
                                role="img"
                                aria-label="Ask Izzy"
                            />
                        </div>
                    </div>
                    <HeaderBar
                        primaryText="What do you need?"
                    >
                        <form
                            className="search"
                            onSubmit={this.onSearchSubmit.bind(this)}
                        >
                            <div className="searchWrapper">
                                <input
                                    ref="search"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    defaultValue={storage.getSearch()}
                                />
                                <icons.Search
                                    className="icon"
                                    onClick={this.onSearchSubmit.bind(this)}
                                />
                            </div>
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
