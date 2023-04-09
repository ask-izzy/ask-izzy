import React, {ReactNode} from "react"
import {useEffect, useState} from "react";
import { useRouter } from "next/router"

import HeaderBar from "@/src/components/HeaderBar.js";
import SearchBar from "@/src/components/general/SearchBar.js";
import CategoriesList from "@/src/components/CategoriesList.js";
import storage from "@/src/storage.js";
import BrandedFooter from "@/src/components/BrandedFooter.js";
import { resetDfvOptions } from "@/src/utils/domesticViolence.js";
import QuestionStepper from "@/src/components/QuestionStepper.js";
import AlertBannerList from "@/src/components/AlertBannerList.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import {goToPersonalisationNextPath} from "@/src/utils/routing.js"



const LOGO = "/images/ask-izzy-logo-single-line-yellow.svg";

function HomePage(): ReactNode {

    const router = useRouter()
    const [location, setLocation] = useState<string | null>(null)
    const [initialSearchText, setInitialSearchText] = useState<string>("")


    useEffect(() => {
        const savedLocation = storage.getSearchArea();
        savedLocation && setLocation(savedLocation)

        const savedSearchText = storage.getSearch();
        savedSearchText && setInitialSearchText(savedSearchText)
        resetDfvOptions();
    }, [])

    const onSearchSubmit = (searchText): void => {
        storage.setSearch(searchText);
        goToPersonalisationNextPath({
            router,
            category: "search",
            searchText,
        })
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
                        Search over 400,000 support services.
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
                        onChange={event => {
                            if (!(event.target as HTMLInputElement).value) {
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

HomePage.pageTitle = null
HomePage.pageType = ["Home"]

export default HomePage;
