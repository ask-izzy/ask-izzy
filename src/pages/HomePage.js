/* @flow */

import type {Node as ReactNode} from "React";
import React, {useContext, useEffect, useState} from "react";

import HeaderBar from "../components/HeaderBar";
import icons from "../icons"
import FlatButton from "../components/FlatButton";
import CategoriesList from "../components/CategoriesList";
import storage from "../storage";
import BrandedFooter from "../components/BrandedFooter";
import { resetDfvOptions } from "../utils/domesticViolence";
import routerContext from "../contexts/router-context";
import QuestionStepper from "./QuestionStepper";
import Storage from "../storage";
import AlertBannerList from "../components/AlertBannerList";
import ScreenReader from "../components/ScreenReader";


const LOGO = "/static/images/ask-izzy-logo-single-line-yellow.svg";

function HomePage(): ReactNode {

    const {router} = useContext(routerContext)
    const [location, setLocation] = useState<?string>(null)
    const [searchText, setSearchText] = useState<string>("")


    useEffect(() => {
        // Clear all personalisation data when returning to the home page. But
        // don't do that if environment is a running test. Not ideal, really the
        // tests should be updated to reflect this new behaviour, but that would
        // be a significant amount of work and it has been decided it's not
        // worth it for alpha/beta code.
        if (!(window && window.isTestEnv)) {
            console.log("Clearing all personalisation data")
            storage.clear();
        }

        const savedLocation = Storage.getLocation();
        const savedSearchText = storage.getSearch();
        savedLocation && setLocation(savedLocation)
        savedSearchText && setSearchText(savedSearchText)
        resetDfvOptions();
    }, [])

    const onSearchSubmit = (): void => {
        storage.setSearch(searchText);
        router.navigate(
            `/search/${encodeURIComponent(searchText)}`
        );
    }

    return (
        <div className="HomePage">
            <section
                role="complementary"
                className="page-header-section"
                aria-labelledby="header"
            >
                <ScreenReader>
                    <span id="header">
                        Header.
                    </span>
                </ScreenReader>
                <HeaderBar
                    primaryText={<>
                        <img
                            src={LOGO}
                            className="homepage-logo"
                            alt="AskIzzy."
                        />
                        Find the help you need, now and nearby.
                    </>}
                    secondaryText={<div className="secondary">
                        Search over 370,000 support services.
                    </div>}
                    bannerName="homepage"
                    hideLogoWhenNotABar={true}
                    taperColour="LighterGrey"
                />
                <AlertBannerList
                    screenLocation="homePage"
                />
                <div
                    role="search"
                    aria-labelledby="searchBox"
                >
                    <ScreenReader>
                        <span id="searchBox">
                            Search Box.
                        </span>
                    </ScreenReader>
                    <div
                        className={`search ${
                            location ? "locationSet" : ""}`}
                    >
                        <label htmlFor="home-page-search"
                            className="searchLabel"
                        >
                            <h2>What do you need help with?</h2>
                        </label>
                        <div className="searchWrapper">
                            <label
                                htmlFor="home-page-search"
                            >
                                <icons.Search
                                    className={"searchIcon medium middle"}
                                    fill="#8c8c8c"
                                />
                            </label>
                            <input
                                id="home-page-search"
                                type="search"
                                onChange={(evt) => {
                                    setSearchText(evt.target.value)
                                }}
                                value={searchText}
                                onKeyDown={(evt) => {
                                    console.log(searchText !== "")
                                    evt.key === "Enter" && searchText !== "" &&
                                    onSearchSubmit()
                                }}
                            />
                            {
                                searchText &&
                                <FlatButton
                                    className="clear-text"
                                    label="X"
                                    aria-label="Clear entered search text"
                                    prompt="Clear"
                                    onClick={() => {
                                        setSearchText("")
                                        storage.setSearch("");
                                    }}
                                />
                            }
                            <FlatButton
                                label="Search"
                                className="searchButton"
                                onClick={searchText && onSearchSubmit}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    {location &&
                        <div>
                            <QuestionStepper
                                home={true}
                                initialTabIndex={0}
                                onClear={() =>
                                    setLocation(null)
                                }
                            />
                        </div>
                    }
                </div>
            </section>
            <main aria-labelledby="categories">
                <ScreenReader>
                    <span id="categories">
                        Categories.
                    </span>
                </ScreenReader>
                <CategoriesList />
            </main>

            <BrandedFooter />
        </div>
    );

}

export default HomePage;
