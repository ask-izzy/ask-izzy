/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import HeaderBar from "../components/HeaderBar";
import icons from "../icons"
import FlatButton from "../components/FlatButton";
import NavBar from "../components/NavBar";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { resetDfvOptions } from "../utils/domesticViolence";
import routerContext from "../contexts/router-context";
import AppBar from "../components/AppBar";
import QuestionStepper from "./QuestionStepper";
import Storage from "../storage";
import AlertBannerList from "../components/AlertBannerList";

type State = {
    location: ?string,
}

class HomePage extends React.Component<{}, State> {

    search: ?HTMLInputElement;

    static contextType: any = routerContext;

    constructor(props: Object) {
        super(props);
        this.state = {
            location: null,
        }
        resetDfvOptions();
    }

    componentDidMount() {
        const location = Storage.getLocation();
        location && this.setState({location})
    }

    onSearchSubmit(event: Event): void {
        event.preventDefault();

        const search = this.search ? this.search.value : "";

        if (search === "") {
            /* FIXME: should this give some user feedback? */
            return;
        }

        storage.setSearch(search);

        this.context.router.navigate(
            `/search/${encodeURIComponent(search)}`
        );
    }

    render(): ReactElement<"div"> {
        const logo = "/static/images/ask-izzy-logo-single-line-yellow.svg";
        return (
            <div className="HomePage">
                <AppBar
                    containerClassName="appbar"
                    fixedSizeQuickExit={true}
                />
                <section className="page-header-section">
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
                    <AlertBannerList
                        screenLocation="homePage"
                    />
                    <form
                        className={`search ${
                            this.state.location ? "locationSet" : ""}`}
                        onSubmit={this.onSearchSubmit.bind(this)}
                    >
                        <label htmlFor="home-page-search"
                            className="searchLabel"
                            aria-label="What do you need help with?"
                        >
                            <h4>What do you need help with?</h4>
                        </label>
                        <div className="searchWrapper">
                            <label
                                htmlFor="home-page-search"
                                aria-label="Search"
                            >
                                <icons.Search
                                    className={"searchIcon medium middle"}
                                    fill="#8c8c8c"
                                />
                            </label>
                            <input
                                id="home-page-search"
                                ref={element => {
                                    this.search = element;
                                }}
                                type="search"
                                aria-label="Search"
                                defaultValue={storage.getSearch()}
                            />
                            <FlatButton
                                label="Search"
                                onClick={this.onSearchSubmit.bind(this)}
                            />
                        </div>
                    </form>
                    <div>
                        {this.state.location &&
                            <div>
                                <QuestionStepper
                                    home={true}
                                    initialTabIndex={5}
                                    onClear={() =>
                                        this.setState({location: null})}
                                />
                            </div>}
                    </div>
                </section>
                <NavBar />

                <BrandedFooter />
            </div>
        );
    }
}

export default HomePage;
