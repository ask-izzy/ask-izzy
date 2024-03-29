/* @flow */
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react"

import React, {useRef, useState, useEffect} from "react"
import _ from "underscore";
import debounce from "just-debounce-it";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import {browserSupportsGeolocation} from "@/src/geolocation";
import icons from "@/src/icons";
import storage from "@/src/storage";
import type {Geolocation} from "@/src/storage";
import {getIssClient, getIssVersion} from "@/src/iss/client"
import type {ISS3AreaLocation} from "@/src/ix-web-js-client/apis/iss/v3";
import QuestionStepper from "@/src/components/QuestionStepper";
import WithStickyFooter from "@/src/components/WithStickyFooter";
import ScreenReader from "@/src/components/ScreenReader";
import FlatButton from "@/src/components/FlatButton";
import InputWithDropdown from "@/components/general/InputWithDropdown";
import GeolocationButton from "@/src/components/GeolocationButton";
import HeaderBar from "@/src/components/HeaderBar";
import type {GeolocationStatus} from "@/src/components/GeolocationButton";
import {
    getCategoryFromRouter,
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing"
import type {
    PersonalisationLocationPage,
} from "@/src/../flow/personalisation-page";
import {
    getBannerName,
} from "@/src/utils/personalisation";
import Category from "@/src/constants/Category"

type LocationType = {|name: string|} | Geolocation

type Props = {
    router: NextRouter,
    details: PersonalisationLocationPage,
}

type initialSuggestions = {
    value: string,
    label: ReactNode
}

function Location({router, details}: Props): ReactNode {
    const searchInputRef = useRef()
    const GeolocationButtonClickRef = useRef()
    const locationNameInputRef = useRef()
    const [gettingAutocompletionsInProgress, setGettingAutocompletionsInProgress] = useState<boolean>(false)
    const [locationNameInput, setLocationNameInput] = useState<string>("")
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null)
    const [autocompletions, setAutocompletionsState] = useState<Array<ISS3AreaLocation>>([])
    const [prevAutocompletions, setPrevAutocompletions] = useState<Array<ISS3AreaLocation>>([])
    const [nextDisabled, setNextDisabled] = useState<boolean>(true)
    const [category] = useState<?Category>(getCategoryFromRouter(router))

    useEffect(() => {
        const userLocation = storage.getUserGeolocation()
        const searchLocation = storage.getSearchArea()
        let location: LocationType = {}
        if (userLocation) {

            if (searchLocation.length == 0 || searchLocation === userLocation.name) {
                location = userLocation
            }
        } else if (searchLocation.length != 0) {

            location = {name: searchLocation}
        }

        if (location && Object.keys(location).length !== 0) {
            setLocation(location)
        }

    }, [])

    useEffect(() => {
        // After state updates, make sure you can see the input
        if (
            searchInputRef.current &&
            searchInputRef.current === document.activeElement &&
            prevAutocompletions !== autocompletions
        ) {
            scrollToSearchControl();
        }
    }, [])

    const goBackPath = getPersonalisationBackPath(router)
    const isSummaryRoute = goBackPath.includes("/summary")

    function setLocation(location: LocationType): void {
        setSelectedLocation(location)
        setLocationInput(location.name)
        setNextDisabled(false)
        setAutocompletions([])
    }

    function setAutocompletions(newAutocompletions: Array<ISS3AreaLocation>): void {
        setPrevAutocompletions(autocompletions)
        setAutocompletionsState(newAutocompletions)
    }

    function setLocationInput(input: string) {
        locationNameInputRef.current = input
        setLocationNameInput(input)
    }


    function onDoneTouchTap(event): void {
        event.preventDefault()
        if (nextDisabled) {
            return
        }
        if (!selectedLocation) {
            console.error(
                "We should not be able to progress without selecting " +
                    "a location"
            )
            return
        }
        storage.setSearchArea(selectedLocation.name);
        if (isGeolocation(selectedLocation)) {
            storage.setUserGeolocation(selectedLocation)
        } else {
            storage.clearUserGeolocation()
        }
        goToPersonalisationNextPath({router: router})

    }

    function triggerAutocomplete(newLocationNameInput: string): void {
        if (newLocationNameInput.length < 1) {
            setAutocompletions([])
            setGettingAutocompletionsInProgress(false)
            return
        }
        setGettingAutocompletionsInProgress(true)

        getAutocompletionSuggestions(newLocationNameInput)
    }

    const getAutocompletionSuggestions: (string) => Promise<void> = debounce(
        async(input: string) => {
            let results
            try {
                const issVersion = getIssVersion()
                if (issVersion === "3") {
                    const iss3Client = await getIssClient(issVersion)
                    results = await iss3Client.searchLocations({
                        name: input,
                        kind: ["postcode", "suburb", "town"],
                    })
                } else if (issVersion === "4") {
                    throw Error("ISS4 not yet supported")
                }
            } catch (error) {
                console.error(
                    "Error trying to get location autocomplete",
                    error
                )
            }

            // Check to make sure input hasn't change in the meantime
            if (locationNameInputRef.current && input !== locationNameInputRef.current) {
                return
            }


            if (results) {
                setAutocompletions(_.uniq(
                    Array.from(results.objects),
                    false,
                    ({name, state}) => name + state
                ))
            }

            setGettingAutocompletionsInProgress(false)
        },
        500,
        true
    )



    function clearSelectedLocation(): void {
        setSelectedLocation(null)
        setNextDisabled(true)
    }

    function scrollToSearchControl(): void {
        if (searchInputRef.current) {
            // Scroll the input to just under the appbar
            window.scrollTo(
                0,
                searchInputRef.current.getBoundingClientRect().top +
                    window.scrollY - 50
            );
        }
    }

    function onSearchChange(event): void {
        const newValue = event.target.value
        const matchingAutocomplete = autocompletions.find(
            area => `${area.name}, ${area.state}` === newValue
        )
        if (matchingAutocomplete) {
            return selectAutocomplete(matchingAutocomplete)
        }
        const newLocationNameInput = newValue.replace(/^\s+/, "")

        setLocationInput(newLocationNameInput)
        clearSelectedLocation()
        triggerAutocomplete(newLocationNameInput)
    }

    function onGeolocationStatusChange(status: GeolocationStatus): void {
        if (
            status.type === "COMPLETE" &&
            status.location
        ) {
            setLocation(status.location)
        }
    }

    function selectAutocomplete(result: ISS3AreaLocation): void {
        /* set the text box to this value
         * and remove the autocompletions */
        const location: LocationType = {
            name: `${result.name}, ${result.state}`,
        }
        setLocation(location)
        setAutocompletions([])
    }

    function getInitialSuggestions(): Array<initialSuggestions> {
        const GeolocationComponent =
            <div className="GeoLocationButtonContainer" >
                {browserSupportsGeolocation() &&
                    <>
                        {isGeolocation(selectedLocation)}
                        <GeolocationButton
                            onStatusChange={onGeolocationStatusChange}
                            locationValue={
                                isGeolocation(selectedLocation) ?
                                    selectedLocation
                                    : undefined
                            }
                            buttonClickRef={(clickRef) => {
                                GeolocationButtonClickRef.current = clickRef
                            }}
                        />
                    </>
                }
            </div>
        const Explainer =
            <h3 className="explainer">
                <span className="explainerIcons">
                    <icons.Walk/>
                    <icons.Tram/>
                    <icons.Car/>
                </span>
                <span>
                    <p>
                        Get your location if you want
                         to see estimated travel times to services
                    </p>
                </span>
            </h3>
        let initialSuggestions = [{
            value: "",
            label:
                <div className = "initialSuggestions" >
                    {GeolocationComponent}
                    {
                        !selectedLocation &&
                            Explainer
                    }
                </div>,

        }]

        if (gettingAutocompletionsInProgress) {
            return []
        }
        return initialSuggestions
    }

    function onInitialSuggestionsSelected() {
        GeolocationButtonClickRef.current &&
        GeolocationButtonClickRef.current()

    }

    function renderDoneButton(): ReactNode {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label="Next"
                        className="doneButton"
                        onClick={onDoneTouchTap}
                        disabled={nextDisabled}
                    />
                </div>
            </div>
        )
    }

    function isGeolocation(location: ?LocationType): boolean %checks {
        return !!(location && location.longitude && location.latitude)
    }

    return (
        <div className="Location">
            <div>
                <section className="page-header-section">
                    <HeaderBar
                        primaryText={
                            "Where are you looking for help?"
                        }
                        secondaryText={
                            "Find services near you"
                        }
                        taperColour={"LighterGrey"}
                        fixedAppBar={true}
                        bannerName={getBannerName(
                            category,
                            details.name
                        )}
                        backUrl={isSummaryRoute ? goBackPath : undefined}
                        backMessage={
                            isSummaryRoute ? "Back to answers" : undefined
                        }
                    />
                    <div className="questionsBar">
                        <ScreenReader>
                            <a
                                href="#mainPageContent"
                                aria-label={
                                    "Skip your previously selected " +
                                    "answers and go straight to the " +
                                    "options."
                                }
                            >
                                Skip to make your selection
                            </a>
                        </ScreenReader>
                        <QuestionStepper />
                    </div>
                </section>
            </div>
            <main
                id="mainPageContent"
                aria-label="Questions"
            >
                <WithStickyFooter
                    footerContents={renderDoneButton()}
                >
                    <fieldset>
                        <legend>
                            Where are you looking for help?
                        </legend>
                        <div className="search">
                            <InputWithDropdown
                                ref={searchInputRef}
                                type="search"
                                showClearButton={true}
                                aria-label="Search for a suburb
                                or postcode"
                                placeholder="Search for a suburb
                                or postcode"
                                value={locationNameInput}
                                onChange={onSearchChange}
                                initialSuggestions={
                                    getInitialSuggestions()
                                }
                                onInitialSuggestionsSelected = {
                                    onInitialSuggestionsSelected
                                }
                                initialSuggestionsA11yStatusMessage = {
                                    selectedLocation ?
                                        ""
                                        : "Press enter to get your location."
                                }
                                loadingResults={gettingAutocompletionsInProgress}
                                autocompleteValues={
                                    autocompletions
                                        .map(location => ({
                                            value: `${location.name},` +
                                            ` ${location.state}`,
                                            label: <>
                                            <div className="suburb">
                                                {location.name}
                                            </div>
                                            <ScreenReader>,{" "}</ScreenReader>
                                            <div className="state">
                                                {location.state}
                                            </div>
                                        </>,
                                        }))
                                }
                            />
                        </div>
                        {gettingAutocompletionsInProgress &&
                            <div className="progress">
                                <icons.Loading
                                    aria-label="Loading locations"
                                    className="big"
                                />
                            </div>
                        }
                    </fieldset>
                </WithStickyFooter>
            </main>
        </div>
    )
}

export default (
    withRouter(Location):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof Location>,
                    {router: *}
                >
            >
        >
)
