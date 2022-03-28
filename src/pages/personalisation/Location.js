/* @flow */
import type {Node as ReactNode} from "react"

import React, {createRef} from "react";
import _ from "underscore";
import debounce from "just-debounce-it";

import {browserSupportsGeolocation} from "../../geolocation";
import components from "../../components";
import icons from "../../icons";
import storage from "../../storage";
import type {Geolocation} from "../../storage";
import {getIssClient, getIssVersion} from "../../iss/client"
import type {LocationAutocompleteSuggestions} from "../../locations";
import {
    getLocationAutocompleteSuggestions,
    getLocationDetails
} from "../../locations"
import type { SearchQueryChanges } from "../../iss/searchQueryBuilder";
import QuestionStepper from "../../components/QuestionStepper";
import {getCategory} from "../../constants/categories";
import WithStickyFooter from "../../components/WithStickyFooter";
import ScreenReader from "../../components/ScreenReader";
import FlatButton from "../../components/FlatButton";
import Input from "../../components/base/Input";
import GeolocationButton from "../../components/GeolocationButton";
import type {GeolocationStatus} from "../../components/GeolocationButton";
import routerContext from "../../contexts/router-context";
import type {
    PersonalisationPageProps,
    PersonalisationNonQuestionPageDefaultProps,
    PersonalisationPageState,
} from "../../utils/personalisation";
import {
    getBannerName,
} from "../../utils/personalisation";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../../utils/page-loading"

type location = {|name: string|} | Geolocation

type State = {
    ...PersonalisationPageState,
    gettingAutocompletionsInProgress: boolean,
    locationNameInput: string,
    selectedLocation: ?location,
    autocompletions: Array<LocationAutocompleteSuggestions>,
    nextDisabled: boolean,
}

// We need to create the defaultProps out of the component first otherwise flow
// doesn't typecheck it
const defaultProps: PersonalisationNonQuestionPageDefaultProps = {
    name: "location",
    heading: "Location",
};

class Location extends React.Component<
    PersonalisationPageProps,
    State
> {
    static defaultProps: PersonalisationNonQuestionPageDefaultProps =
        defaultProps
    static contextType: any = routerContext;

    searchInputRef: { current: null | HTMLInputElement } = createRef()

    constructor(props: Object) {
        super(props);
        this.state = {
            gettingAutocompletionsInProgress: false,
            locationNameInput: "",
            selectedLocation: null,
            autocompletions: [],
            nextDisabled: true,
            category: undefined,
        };
    }

    componentDidMount(): void {
        const searchLocation = storage.getJSON(this.props.name)

        if (searchLocation) {
            this.setSelectedLocation(searchLocation)
        }
        const category = getCategory(
            this.context.router.match.params.page
        )
        this.setState({
            category,
        })
    }

    /* eslint-disable react/sort-comp */
    static title: string = "Location";

    static headingValue(): ?string {
        return this.savedAnswer && `in ${this.prettyPrintAnswer(this.savedAnswer)}`
    }

    static get savedAnswer(): Geolocation {
        return storage.getJSON(defaultProps.name);
    }

    static prettyPrintAnswer(answer: Geolocation): string {
        return answer.name;
    }

    static shouldInjectAccessPoints(): boolean {
        return false;
    }

    static getSearchQueryChanges(): SearchQueryChanges | null {
        /* Location/Area is required */
        const location = storage.getLocation();
        if (!location) {
            return null;
        }

        return {location}
    }

    static summaryLabel: string = "Where are you looking for help?";

    static get summaryValue(): string {
        return storage.getJSON(defaultProps.name)?.name;
    }

    static getShouldShowInSummary(): boolean {
        return true;
    }

    onDoneTouchTap(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        if (!this.state.nextDisabled) {
            this.props.onDoneTouchTap();
        }
    }

    triggerAutocomplete(newLocationNameInput: string) {
        if (newLocationNameInput.length < 1) {
            if (this.state.gettingAutocompletionsInProgress) {
                closePageLoadDependencies(
                    this.context.router.location,
                    "autocompleteSuggestionsLoad"
                )
            }
            this.setState({
                autocompletions: [],
                gettingAutocompletionsInProgress: false,
            });
            return
        }

        this.setState({
            gettingAutocompletionsInProgress: true,
        });

        addPageLoadDependencies(
            this.context.router.location,
            "autocompleteSuggestionsLoad"
        )
        this.getAutocompletionSuggestions(newLocationNameInput)
    }

    getAutocompletionSuggestions: (string) => Promise<void> = debounce(
        async(input: string) => {
            let results
            try {
                results = await getLocationAutocompleteSuggestions(input)
            } catch (error) {
                console.error(
                    "Error trying to get location autocomplete",
                    error
                )
            }

            // Check to make sure input hasn't change in the meantime
            if (input !== this.state.locationNameInput) {
                return
            }

            if (results) {
                this.setState({
                    autocompletions: _.uniq(
                        Array.from(results),
                        false,
                        ({name, state}) => name + state
                    ),
                });
            }

            this.setState({
                gettingAutocompletionsInProgress: false,
            });
            closePageLoadDependencies(
                this.context.router.location,
                "autocompleteSuggestionsLoad"
            )
        },
        500,
        true
    )

    setSelectedLocation(location: location): void {
        this.setState({
            selectedLocation: location,
            locationNameInput: location.name,
            nextDisabled: false,
            autocompletions: [],
        });
    }

    clearSelectedLocation(): void {
        this.setState({
            selectedLocation: null,
            nextDisabled: true,
        });
    }
    clearLocationInput(): void {
        this.setState({
            locationNameInput: "",
            autocompletions: [],
        });
    }

    onNextStep(): void {
        if (this.state.selectedLocation) {
            storage.setJSON(this.props.name, this.state.selectedLocation)
        } else {
            console.error(
                "We should not be able to progress without selecting a location"
            )
        }
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        // After state updates, make sure you can see the input
        if (
            this.searchInputRef.current &&
            this.searchInputRef.current === document.activeElement &&
            prevState.autocompletions !== this.state.autocompletions
        ) {
            this.scrollToSearchControl();
        }
    }

    scrollToSearchControl(): void {
        if (this.searchInputRef.current) {
            // Scroll the input to just under the appbar
            window.scrollTo(
                0,
                this.searchInputRef.current.getBoundingClientRect().top +
                    window.scrollY - 50
            );
        }
    }

    onSearchChange(newValue: string): void {
        const matchingAutocomplete = this.state.autocompletions.find(
            area => `${area.name}, ${area.state}` === newValue
        )
        if (matchingAutocomplete) {
            return this.selectAutocomplete(matchingAutocomplete)
        }
        const newLocationNameInput = newValue.replace(/^\s+/, "")

        this.setState({
            locationNameInput: newLocationNameInput,
        });

        this.clearSelectedLocation();

        this.triggerAutocomplete(newLocationNameInput);
    }

    onGeolocationStatusChange(status: GeolocationStatus): void {
        if (
            status.type === "COMPLETE" &&
            status.location
        ) {
            this.setSelectedLocation(status.location);
        }
    }

    async selectAutocomplete(result: LocationAutocompleteSuggestions): void {
        /* set the text box to this value
         * and remove the autocompletions */
        const locationDetails = await getLocationDetails(result.id, result.locationType)
        const location: location = {
            name: `${result.name}, ${result.state}`,
            latitude: locationDetails.centroid[1],
            longitude: locationDetails.centroid[0],
            approximate: true
        };
        this.setSelectedLocation(location);
        this.setState({
            autocompletions: [],
        });
    }

    render: (() => ReactNode) = () => (
        <div className="Location">
            <div>
                <section className="page-header-section">
                    <components.HeaderBar
                        primaryText={
                            "Where are you looking for help?"
                        }
                        secondaryText={
                            "Find services near you"
                        }
                        taperColour={"LighterGrey"}
                        fixedAppBar={true}
                        bannerName={getBannerName(
                            this.state.category,
                            this.props.name
                        )}
                        {...this.props.backToAnswers && {
                            goBack: {
                                backMessage: "Back to answers",
                                onBackTouchTap: this.props.goBack,
                            },
                        }}
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
                    footerContents={this.renderDoneButton()}
                >
                    <fieldset>
                        <legend>
                            Where are you looking for help?
                        </legend>
                        <div className="search">
                            <Input
                                ref={this.searchInputRef}
                                type="search"
                                showClearButton={true}
                                aria-label="Search for a suburb
                                 or postcode"
                                placeholder="Search for a suburb
                                 or postcode"
                                value={this.state.locationNameInput}
                                onChange={this.onSearchChange.bind(this)}
                                autocompleteValues={this.state.autocompletions
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
                        {this.state.gettingAutocompletionsInProgress &&
                            <div className="progress">
                                <icons.Loading
                                    aria-label="Loading locations"
                                    className="big"
                                />
                            </div>
                        }
                    </fieldset>
                    <div className="GeoLocationButtonContainer">
                        {browserSupportsGeolocation() && <>
                            {isGeolocation(this.state.selectedLocation) ||
                                <span className="or">Or</span>
                            }
                            <GeolocationButton
                                onStatusChange={
                                    this.onGeolocationStatusChange
                                        .bind(this)
                                }
                                locationValue={
                                    isGeolocation(this.state.selectedLocation) ?
                                        this.state.selectedLocation
                                        : undefined
                                }
                            />
                        </>}
                    </div>
                    <h3 className="explainer">
                        <span className="explainerIcons">
                            <icons.Walk/>
                            <icons.Tram/>
                            <icons.Car/>
                        </span>
                        <em>
                            If you want to see estimated travel times
                            to services use 'Get your current location' above.
                        </em>
                    </h3>
                </WithStickyFooter>
            </main>
        </div>
    );

    renderDoneButton(): ReactNode {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label="Next"
                        className="doneButton"
                        onClick={this.onDoneTouchTap.bind(this)}
                        disabled={this.state.nextDisabled}
                    />
                </div>
            </div>
        )
    }
}

// Flow doesn't support the use of "%checks" in class methods so we have to
// move this function out of the class
// https://github.com/facebook/flow/issues/7920
function isGeolocation(location: ?location): boolean %checks {
    return !!(location && location.longitude && location.latitude)
}

export default Location;
