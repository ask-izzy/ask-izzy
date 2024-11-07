/* @flow */

import type { Node as ReactNode } from "React";
import React from "react";
import { useRouter } from "next/router";

import Link from "@/src/components/base/Link";
import StaticPage from "@/components/pages/StaticPage";
import Chevron from "@/src/icons/Chevron";
import { getCategory } from "@/src/constants/categories";
import {
    goToPersonalisationNextPath,
} from "@/src/utils/routing";

function DisabilityAdvocacyFinder(): ReactNode {
    const router = useRouter();

    const disabilityGatewayURL = "https://www.disabilitygateway.gov.au/";

    const handleSearch = (helpSpecialisation) => {
        const category = getCategory("disability-advocacy-finder");

        if (category) {
            goToPersonalisationNextPath({
                router,
                category: "disability-advocacy-finder",
                searchText: helpSpecialisation,
            });
        } else {
            console.error("Category not found");
        }
    };

    return (
        <StaticPage
            title="Disability Advocacy"
            bannerPrimary="Disability Advocacy"
            bannerSecondary="Find advocacy services near you"
            bannerName="hand-and-building-and-person static"
        >
            <div className="DisabilityAdvocacyFinder">
                <h2>
                    A disability advocate can support you with a problem to understand your rights and options
                </h2>
                <hr />

                <div className="disabilityHeader">
                    <button
                        className="disabilityButton clickable"
                        onClick={() => handleSearch("general")}
                    >
                        Find a disability advocate
                    </button>
                    <div className="orText">or</div>
                    <button className="disabilityButton static">
                        What do you need help with?
                    </button>
                    <div className="connectedButtons">
                        <button
                            className="disabilitySubButton"
                            onClick={() => handleSearch("general")}
                        >
                            General disability advocacy
                        </button>
                        <div className="divider" />
                        <button
                            className="disabilitySubButton"
                            onClick={() => handleSearch("ndis-appeals")}
                        >
                            Administrative Review Tribunal (ART) - NDIS appeals
                        </button>
                        {/* Commented out for future use
                        <div className="divider" />
                        <button
                            className="disabilitySubButton"
                            onClick={() => handleSearch("indigenous")}
                        >
                            Aboriginal & Torres Strait Islander services
                        </button>
                        <div className="divider" />
                        <button
                            className="disabilitySubButton"
                            onClick={() => handleSearch("cald")}
                        >
                            Culturally & Linguistically Diverse (CALD) services
                        </button>
                        */}
                    </div>
                </div>

                <div className="socialserviceslist">
                    <h3>
                        For information about disability advocacy go to the Department of Social Services website:
                    </h3>
                    <ul>
                        <li>
                            <Link to="https://www.dss.gov.au/our-responsibilities/disability-and-carers/program-services/for-people-with-disability/national-disability-advocacy-program-ndap">
                                National Disability Advocacy Program
                            </Link>
                        </li>
                        <li>
                            <Link to="https://www.dss.gov.au/disability-and-carers/programs-services/for-people-with-disability/ndis-appeals">
                                NDIS Appeals Program
                            </Link>
                        </li>
                        <li>
                            <Link to="https://www.dss.gov.au/disability-and-carers-programs-services-for-people-with-disability/disability-advocacy-for-individuals-easy-read">
                                Individual Disability Advocacy Factsheet (Easy Read)
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="askIzzyInfoBox">
                    <h2>
                        Search <Link to="/">Ask Izzy</Link> for other support services
                    </h2>
                    <p>
                        Ask Izzy is a free and anonymous website that connects people in need
                        with housing, a meal, money help, family violence support, counselling, and much more.
                    </p>
                </div>
                <div className="backToDSS">
                    <Link to={disabilityGatewayURL}>
                        <strong>
                            Return to The Disability Gateway website
                            <Chevron />
                        </strong>
                    </Link>
                </div>
            </div>
        </StaticPage>
    );
}

export default DisabilityAdvocacyFinder;
