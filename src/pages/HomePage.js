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
        let redirectUri = "http://www.bom.gov.au/";
        let tooltip = "To leave this website quickly, click the 'Quick " +
        "Exit' button. If you are in immediate danger call 000 ( " +
        "Australian emergency line), for advice about family violence " +
        " call 1800 Respect on 1800 737 732 (Helpline).";

        return (
            <div className="HomePage">
                <div className="header">
                    <div className="desktop">
                        <a title = {tooltip}
                            href = {redirectUri}
                        >
                            <span className="quick-exit-right">
                            </span>
                            <span className="quick-exit-left">
                                Quick Exit X
                            </span>
                        </a>
                    </div>

                    <div className="mobile_device">

                        <a href={redirectUri}
                            title={tooltip}
                        >
                            <span className="quick-exit-img">
                                <img src="/static/images/exit-large.png"
                                    alt="exit"
                                />
                            </span>
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
