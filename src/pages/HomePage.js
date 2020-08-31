/* @flow */

import React from "react";

import HeaderBar from "../components/HeaderBar";
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { resetDfvOptions } from "../utils";
import history from "../utils/history";

type Props = {
    siteFeatureFlags: Object
}
class HomePage extends React.Component<Props, void> {

    search: ?HTMLInputElement;

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

        history.push(
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
            <div className={"HomePage" + (
                this.props
                    .siteFeatureFlags["site-banner-feature-flag-test"] ?
                    " CurrentEmergency"
                    : ""
            )}
            >
                <div className="header">
                    <div className="desktop">
                        <span className="quick-exit-right" />
                        <a title={tooltip}
                            href={redirectUri}
                        >
                            <span className="quick-exit-left">
                                Quick Exit X
                            </span>
                        </a>
                    </div>

                    <div className="mobile_device">
                        <div className="qexit-txtleft qexit-heightleft" />
                        <a href={redirectUri}
                            title={tooltip}
                        >
                            <div className="qexit-txtright qexit-heightright">
                                Quick Exit
                            </div>
                        </a>
                    </div>

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
                                alt="AskIzzy"
                            />
                            <div className="primary">
                                What do you need?
                            </div>
                            <div className="searchWrapper">
                                <input
                                    ref={element => {
                                        this.search = element;
                                    }}
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
                    {this.props.siteFeatureFlags[
                        "site-banner-feature-flag-test"
                    ] &&
                        <div className="CurrentEmergencyNotice">
                            <h3>
                                The site banner feature flag test is set
                            </h3>
                            <p>
                                Bikie rort rip snorter my tinny. Brickie as
                                stands out like stands out like a waggin'
                                school <a href="https://txtrdr.com/boganipsum/">
                                billabong</a> his blood's worth bottling
                                budgie smugglers.
                            </p>
                        </div>
                    }
                </div>

                <div className="body">
                    <NavBar />
                </div>

                <BrandedFooter />
            </div>
        );
    }
}

export default HomePage;
