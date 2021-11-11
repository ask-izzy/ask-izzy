/* @flow */
import type {
    ElementConfig as ReactElementConfig,
    Node as ReactNode,
} from "react"

import React, {createRef} from "react";
import _ from "underscore";
import debounce from "just-debounce-it";

import {browserSupportsGeolocation} from "../../geolocation";
import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import icons from "../../icons";
import storage from "../../storage";
import type {Geolocation} from "../../storage";
import * as iss from "../../iss";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import Category from "../../constants/Category";
import WithStickyFooter from "../../components/WithStickyFooter";
import ScreenReader from "../../components/ScreenReader";
import AppBar from "../../components/AppBar";
import FlatButton from "../../components/FlatButton";
import Input from "../../components/base/Input";
import GeolocationButton from "../../components/GeolocationButton";
import type {GeolocationStatus} from "../../components/GeolocationButton";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../../utils/page-loading"
type AppBarProps = ReactElementConfig<typeof AppBar>

type Props = {
        name: string,
        onDoneTouchTap: Function,
        backToAnswers?: boolean,
        goBack?: {
            onBackTouchTap?: $PropertyType<AppBarProps, 'onBackTouchTap'>,
            backMessage?: $PropertyType<AppBarProps, 'backMessage'>,
        },
}

type location = {|name: string|} | Geolocation

type State = {
    gettingAutocompletionsInProgress: boolean,
    locationNameInput: string,
    selectedLocation: ?location,
    autocompletions: Array<issArea>,
    nextDisabled: boolean,
    showStepper: boolean,
    category: ?Category,
}

class Location extends Personalisation<Props, State> {
    static defaultProps: ReactElementConfig<typeof Personalisation> = {
        name: "location",
    };

    searchInputRef: { current: null | HTMLInputElement } = createRef()

    constructor(props: Object) {
        super(props);
        this.state = {
            gettingAutocompletionsInProgress: false,
            locationNameInput: "",
            selectedLocation: null,
            autocompletions: [],
            nextDisabled: true,
            showStepper: false,
            category: undefined,
        };
    }

    componentDidMount(): void {
        const userLocation = storage.getUserGeolocation()
        const searchLocation = storage.getSearchArea()

        let location: location
        if (userLocation) {
            if (!searchLocation || searchLocation === userLocation.name) {
                location = userLocation
            }
        } else if (searchLocation) {
            location = {name: searchLocation}
        }

        if (location) {
            this.setSelectedLocation(location)
        }
        const category = getCategory(
            this.context.router.match.params.page
        )
        const searchAnswers = getSearchAnswers();
        this.setState({
            showStepper: category ? fetchAnswers(category).length > 0
                : searchAnswers.length > 0,
            category,
        })
    }

    /* eslint-disable react/sort-comp */
    static title: string = "Location";

    static headingValue(): ?string {
        return this.savedAnswer && `in ${this.savedAnswer}`
    }

    static get savedAnswer(): string {
        return storage.getSearchArea();
    }

    static prettyPrintSavedAnswer(): ?string {
        return this.savedAnswer;
    }

    static shouldInjectAccessPoints(): boolean {
        // Currently only for locations in Victoria.
        let victoriaRegex = /VIC(toria)?$/i;

        return !!victoriaRegex.exec(storage.getSearchArea());
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        /* Location/Area is required */
        const searchArea = storage.getSearchArea();
        if (!searchArea) {
            return null;
        }
        request = Object.assign(request, {area: searchArea});

        /* Coordinates are optional */
        const userLocation = storage.getUserGeolocation();
        if (userLocation && userLocation.name === searchArea) {
            request = Object.assign(request, {
                location: `${userLocation.longitude}E${userLocation.latitude}N`,
            });
        }

        return request;
    }

    static summaryLabel: string = "Where are you?";

    static get summaryValue(): string {
        return storage.getSearchArea();
    }

    static showPage(): boolean {
        return true;
    }

    static showInSummary(): boolean {
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
                results = await iss.getLocations(input)
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
                        Array.from(results.objects),
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
            storage.setSearchArea(this.state.selectedLocation.name);
            if (isGeolocation(this.state.selectedLocation)) {
                storage.setUserGeolocation(this.state.selectedLocation);
            } else {
                storage.clearUserGeolocation()
            }
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

    selectAutocomplete(result: issArea): void {
        /* set the text box to this value
         * and remove the autocompletions */
        const location: location = {
            name: `${result.name}, ${result.state}`,
        };
        this.setSelectedLocation(location);
        this.setState({
            autocompletions: [],
        });
    }

    render: (() => ReactNode) = () => (
        <div className="Location">
            <div
                role="complementary"
                aria-labelledby="header"
            >
                <ScreenReader>
                    <span id="header">
                        Header.
                    </span>
                </ScreenReader>
                <components.HeaderBar
                    primaryText={
                        "Where are you looking for help?"
                    }
                    secondaryText={
                        "Find services near you"
                    }
                    taperColour={this.state.showStepper ? "LighterGrey"
                        : "HeaderBar"}
                    fixedAppBar={true}
                    bannerName={this.bannerName}
                    {...this.props.backToAnswers && {
                        goBack: {
                            backMessage: "Back to answers",
                            onBackTouchTap: this.props.goBack,
                        },
                    }}
                />
                {this.state.showStepper ? (
                    <QuestionStepper
                        initialTabIndex={0}
                        category={this.state.category}
                    />
                ) : null}
            </div>
            <main aria-labelledby="questions">
                <ScreenReader>
                    <span id="questions">
                        Questions.
                    </span>
                </ScreenReader>
                <WithStickyFooter
                    footerContents={this.renderDoneButton()}
                >
                    <fieldset>
                        <legend>
                            Where are you?
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
                        label="Done"
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

export function mergeAccessPoints(
    original: iss.searchResults,
    alternate: iss.searchResults
): iss.searchResults {
    const objects = iss.crisisResults(original.objects).concat(
        alternate.objects,
        iss.nonCrisisResults(original.objects)
    )
    const deduped = _.uniq(objects, false, ({id}) => id);
    const removedCount = objects.length - deduped.length;

    return {
        meta: {
            ...original.meta,
            total_count: original.meta.total_count +
                         alternate.meta.total_count -
                         removedCount,
            available_count: original.meta.available_count +
                             alternate.meta.available_count -
                             removedCount,
        },
        objects: deduped,
    };
}
