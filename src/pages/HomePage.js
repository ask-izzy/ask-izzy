/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
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
        let logo = "/static/images/askizzy-logo.png";

        return (
            <div className="HomePage">
                <div className="header">
                    <HeaderBar
                        primaryText=""
                        bannerName="homepage"
                        alternateBackgroundColor={false}
                    >
                        <form
                            className="search"
                            onSubmit={this.onSearchSubmit.bind(this)}
                        >
                            <img
                                src={logo}
                                className="homepage-logo"
                            />
                            <div className="primary">
                                What do you need?
                            </div>
                            <div className="searchWrapper">
                                <input
                                    ref="search"
                                    type="search"
                                    placeholder=
                                        "e.g. housing, food, legal help"
                                    aria-label="Search"
                                    defaultValue={storage.getSearch()}
                                />
                                <FlatButton
                                    label="Search"
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
