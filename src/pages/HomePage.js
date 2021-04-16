/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import {Link} from "react-router-dom";
import icons from "../icons"
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import {resetDfvOptions} from "../utils";
import routerContext from "../contexts/router-context";
import QuickExit from "../components/QuickExit";

class HomePage extends React.Component<{}, void> {

    search: ?HTMLInputElement;

    static contextType = routerContext;

    constructor(props: Object) {
        super(props);

        resetDfvOptions();
    }

    static contextType = routerContext;

    onSearchSubmit(event: Event): void {
        event.preventDefault();

        const search = this.search ? this.search.value : "";

        if (search === "") {
            /* FIXME: should this give some user feedback? */
            return;
        }

        storage.setSearch(search);

        this.context.router.history.push(
            `/search/${encodeURIComponent(search)}`
        );
    }

    render() {
        const logo = "/static/images/ask-izzy-logo-single-line-yellow.svg";
        return (
            <div className="HomePage">
                <div className="notification">
                    <icons.Info className={"big middle"}/>
                    <div>
                        <h3>
                            Coronavirus (COVID-19) support
                        </h3>
                        <span>
                            Find help and information near you.{" "}
                            <Link to="/covid-19-support">
                                Learn more
                            </Link>
                        </span>
                        <Link to="/covid-19-support-trent">
                            Learn more Trent
                        </Link>
                    </div>
                </div>
                <QuickExit
                    className="appbar"
                    home={true}
                />
                <div className="header">
                    <HeaderBar
                        primaryText={<>
                            <img
                                src={logo}
                                className="homepage-logo"
                                alt="AskIzzy"
                            />
                            Find the help you need, now and nearby
                        </>}
                        secondaryText={<div className="secondary">
                            Search over 370,000 support services
                        </div>}
                        bannerName="homepage"
                        taperColour="LighterGrey"
                    />
                </div>

                <div className="body">
                    <form
                        className="search"
                        onSubmit={this.onSearchSubmit.bind(this)}
                    >
                        <div className="searchWrapper">
                            <input
                                ref={element => {
                                    this.search = element;
                                }}
                                type="search"
                                placeholder={
                                    "Food vouchers, rent assistance, " +
                                    "emergency relief"
                                }
                                aria-label="Search"
                                defaultValue={storage.getSearch()}
                            />
                            <FlatButton
                                label="Search"
                                onClick={this.onSearchSubmit.bind(this)}
                            />
                        </div>
                    </form>
                    <NavBar />
                </div>

                <BrandedFooter />
            </div>
        );
    }
}

export default HomePage;
