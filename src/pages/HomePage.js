/* @flow */

import React from "react";
import PropTypes from "proptypes";

import HeaderBar from "../components/HeaderBar";
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";

import { resetDfvOptions } from "../utils";

class HomePage extends React.Component<{}, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    search: ?HTMLInputElement;

    constructor(props: Object) {
        super(props);

        resetDfvOptions();
    }

    onSearchSubmit(event: Event): void {
        event.preventDefault();

        const search = this.search ? this.search.value : "";

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
        const logo = "/static/images/askizzy-logo.png";
        const redirectUri = "http://www.bom.gov.au/";
        const tooltip = "To leave this website quickly, click the 'Quick " +
        "Exit' button. If you are in immediate danger call 000 ( " +
        "Australian emergency line), for advice about family violence " +
        " call 1800 Respect on 1800 737 732 (Helpline).";

        return (
            <div className="HomePage">
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
                </div>

                <div className="body">
                    <NavBar />
                </div>
            </div>
        );
    }
}

export default HomePage;
