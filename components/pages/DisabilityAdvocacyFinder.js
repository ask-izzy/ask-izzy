/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState} from "react";
import { useRouter } from "next/router"
import escapeStringRegexp from "escape-string-regexp";

import Link from "@/src/components/base/Link";
import StaticPage from "@/components/pages/StaticPage";
import SearchBar from "@/src/components/general/SearchBar";
import Chevron from "@/src/icons/Chevron"
import {
    goToPersonalisationNextPath,
    getPersonalisationNextPath,
} from "@/src/utils/routing"
import isMounted from "@/hooks/useIsMounted"


function DisabilityAdvocacyFinder(): ReactNode {

    const router = useRouter()

    const advocacyProviders = getPersonalisationNextPath({
        router,
        category: "search",
        searchText: "Disability Advocacy Providers",
        pageMounted: isMounted(),
    });
    const disabilityGatewayURL = "https://www.disabilitygateway.gov.au/";
    const disabilityAdvocacyURL =
        "https://disabilityadvocacyfinder.dss.gov.au/disability/ndap/about";
    const [autocompleteValues, setAutocompleteValues] =
        useState<Array<string>>([])

    function updateAutocomplete(event) {
        const inputValue = event.target.value
        const newAutocompleteValues = []
        /* Start looking for matches after at least 3 chars have been
         * entered. Then check to see if input matches a key in out
         * hardcoded autocomplete suggestions map. If so add any suggestions
         * unless the suggestion is a complete match for the input.
         */

        for (const [key, suggestions] of Object.entries(autocompleteMap)) {
            const trimmedInput = inputValue.trim()
            const matchRegEx = new RegExp(
                `^${escapeStringRegexp(trimmedInput)}$`,
                "i"
            );

            if (
                key.slice(0, trimmedInput.length).match(matchRegEx) &&
                trimmedInput.length >= 3
            ) {
                const arrayOfSuggestions: Array<string> =
                    ([suggestions].flat(): any)
                for (const suggestion of arrayOfSuggestions) {
                    if (!suggestion.match(matchRegEx)) {
                        newAutocompleteValues.push(suggestion)
                    }
                }
            }
        }
        setAutocompleteValues(
            newAutocompleteValues.filter(
                (value, index, self) => self.indexOf(value) === index
            )
        )
    }

    return (
        <StaticPage
            title="Disability Advocacy"
            bannerPrimary="Disability Advocacy"
            bannerSecondary="Find advocacy services near you"
            bannerName="advocacy static"
        >
            <div className="DisabilityAdvocacyFinder">
                <h2>Using Ask Izzy to find a Disability Advocate</h2>
                <p>
                    People with disability who need someone to speak up for
                    them can use Ask Izzy to search for independent
                    Disability Advocacy providers in their area. These
                    services provide access to professionals who can ensure
                    the choices and rights of people with disability are
                    respected and they are being treated fairly.
                </p>
                <div className="searchSection">
                    <strong>What kind of advocacy are you looking for?</strong>
                    <br />
                    <div className="de-emphasised">
                        For example: 'NDIS Appeals' or 'Disability Royal
                        Commission'
                    </div>
                    <SearchBar
                        placeholder="Search advocate type"
                        onSubmit={(searchText) => {
                            if (searchText) {
                                searchText = `Disability Advocacy Providers - ${searchText}`
                                goToPersonalisationNextPath({
                                    router,
                                    category: "search",
                                    searchText,
                                })
                            }
                        }}
                        onChange={updateAutocomplete}
                        autocompleteValues={autocompleteValues}
                    />
                    <p>
                        <strong>
                            Unsure what kind of advocacy services will help you?
                        </strong>
                        {" "}<Link to={advocacyProviders}>
                            Browse all disability advocacy services
                        </Link>
                    </p>
                </div>
                <div>
                    <h3>
                        Want more information about disability advocacy?
                    </h3>
                    <Link
                        to={disabilityAdvocacyURL}
                    >
                        See the Department of Social Services website
                    </Link>
                </div>
                <div className="askIzzyInfoBox">
                    <h2>Other support services on Ask Izzy</h2>
                    <p>
                        Ask Izzy is a website that connects people in need
                        with housing, a meal, money help, family violence
                        support, counselling and much more.
                    </p>
                    <p>
                        It is free and anonymous, with over 400,000 services
                        listed across Australia.
                    </p>
                    <Link
                        to="/"
                        className="allServicesLink"
                    >
                        Browse all support services
                    </Link>
                </div>
                <div className="backToDSS">
                    <Link to={disabilityGatewayURL}>
                        <strong>
                            Return to The Disability Gateway website<Chevron />
                        </strong>
                    </Link>
                </div>
            </div>
        </StaticPage>
    );
}

export default DisabilityAdvocacyFinder;


const autocompleteMap = {
    "Disability Advocacy": [
        "Disability Royal Commission Advocacy",
        "Disability Advocacy",
    ],
    "Disability Royal Commission Advocacy": "Disability Royal Commission Advocacy",
    DRC: "Disability Royal Commission Advocacy",
    "Royal Commission Advocacy": "Disability Royal Commission Advocacy",
    Help: [
        "Disability Royal Commission Advocacy",
        "Disability Advocacy",
        "NDIS Appeals",
    ],
    "NDIS Appeals": [
        "NDIS Appeals",
        "Disability Advocacy",
    ],
    Appeals: "NDIS Appeals",
    Advocacy: "Disability Advocacy",
    NDAP: "Disability Advocacy",
    Advocate: "Disability Advocacy",
    "Royal Commission": "Disability Royal Commission Advocacy",
    Abuse: "Disability Royal Commission Advocacy",
    Neglect: "Disability Royal Commission Advocacy",
    Violence: "Disability Royal Commission Advocacy",
    Exploitation: "Disability Royal Commission Advocacy",
    AAT: "NDIS Appeals",
    NDIA: "NDIS Appeals",
    "Support coordination": [
        "NDIS Appeals",
        "Disability Advocacy",
    ],
}
