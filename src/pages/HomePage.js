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
import QuestionStepper from "../components/QuestionStepper";
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
            <section className="page-header-section">
                <HeaderBar
                    primaryText={<>
                        <img
                            src={LOGO}
                            className="homepage-logo"
                            aria-hidden={true}
                        />
                        <ScreenReader>
                            Ask Izzy:{" "}
                        </ScreenReader>
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
                    className={`search ${
                        location ? "locationSet" : ""}`}
                >
                    <h2>What do you need help with?</h2>
                    <SearchBar
                        initialValue={initialSearchText}

                        inputAriaLabel="Search for services"
                        onSubmit={onSearchSubmit}
                        onChange={newValue => {
                            if (!newValue) {
                                storage.setSearch("")
                            }
                        }}
                    />
                </div>
                {location &&
                    <QuestionStepper
                        showQuestionIcons={true}
                        hideStepInfo={true}
                        showClearLocation={true}
                        onClearLocation={() =>
                            setLocation(null)
                        }
                    />
                }
            </section>
            <main aria-label="Categories">
                <CategoriesList />
            </main>

            <BrandedFooter />
        </div>
    );

}

export default HomePage;
