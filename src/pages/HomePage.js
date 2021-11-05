/* @flow */

import type {Node as ReactNode} from "React";
import React, {useContext, useEffect, useState} from "react";

import HeaderBar from "../components/HeaderBar";
import SearchBar from "../components/general/SearchBar";
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
    const [initialSearchText, setInitialSearchText] = useState<string>("")


    useEffect(() => {
        const savedLocation = Storage.getSearchArea();
        savedLocation && setLocation(savedLocation)

        const savedSearchText = storage.getSearch();
        savedSearchText && setInitialSearchText(savedSearchText)
        resetDfvOptions();
    }, [])

    const onSearchSubmit = (searchText): void => {
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
                        <SearchBar
                            initialValue={initialSearchText}
                            onSubmit={searchText => {
                                searchText && onSearchSubmit(searchText)
                            }}
                            onChange={newValue => {
                                if (!newValue) {
                                    storage.setSearch("")
                                }
                            }}
                        />
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
