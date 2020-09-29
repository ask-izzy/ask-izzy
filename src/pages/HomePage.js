/* @flow */

import React from "react";
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { resetDfvOptions } from "../utils";
import history from "../utils/history";
import HeaderBar from "../components/HeaderBar";

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
        storage.clear();
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
                        primaryText=""
                        bannerName="homepage"
                        alternateBackgroundColor={false}
                    >
                        <img
                            src={logo}
                            className="homepage-logo"
                            alt="AskIzzy"
                        />
                        <div className="primary">
                            Find the help you need, now and nearby
                        </div>
                        <div className="secondary">
                            Search over 370,000 support services
                        </div>
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
