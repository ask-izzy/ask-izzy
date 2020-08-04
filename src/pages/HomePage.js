/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import { Link } from "react-router-dom";
import icons from "../icons"
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { resetDfvOptions } from "../utils";
import routerContext from "../contexts/router-context";

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
        const logo = "/static/images/askizzy-logo.png";
        const redirectUri = "http://www.bom.gov.au/";
        const tooltip = "To leave this website quickly, click the 'Quick " +
        "Exit' button. If you are in immediate danger call 000 ( " +
        "Australian emergency line), for advice about family violence " +
        " call 1800 Respect on 1800 737 732 (Helpline).";

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
                                Learn&nbsp;more
                            </Link>
                        </span>
                    </div>
                </div>
                <div className="appbar">
                    <a className="quick-exit"
                        href={redirectUri}
                        title={tooltip}
                    >
                        <div className="quick-exit">
                            <span>
                                Quick Exit ⨉
                            </span>
                        </div>
                    </a>
                </div>
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
