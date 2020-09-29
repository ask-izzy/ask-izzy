/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { Link } from "react-router-dom";

import { resetDfvOptions } from "../utils";
import routerContext from "../contexts/router-context";

type Props = {
    siteFeatureFlags: Object
}
class HomePage extends React.Component<Props, void> {

    search: ?HTMLInputElement;

    static contextType = routerContext;

    constructor(props: Object) {
        super(props);

        resetDfvOptions();
    }

    componentDidMount(): void {
        // Clear all personalisation data when returning to the home page. But
        // don't do that if environment is a running test. Not ideal, really the
        // tests should be updated to reflect this new behaviour, but that would
        // be a significant amount of work and it has been decided it's not
        // worth it for alpha/beta code.
        if (!(window && window.isTestEnv)) {
            console.log("Clearing all personalisation data")
            storage.clear();
        }
    }

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
                        taperColour="Purple"
                    />
                    <div className="siteBanner-warning">
                        <h3>
                            Welcome to the Ask Izzy Beta
                        </h3>
                        <p>
                            This is where we are trying new features in Ask
                            Izzy, so there may be bugs and incomplete areas.
                            You should{" "}
                            <Link to="/beta-info">read about our beta</Link>
                            {" "}before using this version.
                        </p>
                        <p>
                            <a href="https://askizzy.org.au">
                                You can return to the 'regular' Ask Izzy here.
                            </a>
                        </p>
                        <p>
                            We welcome your feedback
                        </p>
                    </div>
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
                    <div id="cantFindLookingFor">
                        Can't find what you're looking for? Return to{" "}
                        <a href="https://askizzy.org.au">AskIzzy.org.au</a>
                    </div>
                </div>

                <BrandedFooter />
            </div>
        );
    }
}

export default HomePage;
