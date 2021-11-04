/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import * as React from "react";
import { debounce } from "lodash-decorators";
import _ from "underscore";

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
import GeolocationButton from "../../components/GeolocationButton";
import type {GeolocationStatus} from "../../components/GeolocationButton";
type AppBarProps = React.ElementProps<typeof AppBar>

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
    autocompletionInProgress: boolean,
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

    _search: ?HTMLInputElement;

    constructor(props: Object) {
        super(props);
        this.state = {
            autocompletionInProgress: false,
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
        return this.answer && `in ${this.answer}`
    }

    static get answer(): string {
        return storage.getSearchArea();
    }

    static breadcrumbAnswer(): ?any {
        return this.answer;
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
        } else if (this.state.autocompletions[0]) {
            this.selectAutocomplete(this.state.autocompletions[0]);
        }
    }

    /**
     * triggerAutocomplete:
     *
     * Trigger an autocomplete after a 500ms debounce.
     */
    /*::__(){`*/@debounce(500)/*::`}*/
    async triggerAutocomplete(): Promise<void> {
        let input = this.state.locationNameInput;

        if (input.length < 1) {
            this.setState({
                autocompletions: [],
            });
        } else {
            try {
                const results = await iss.getLocations(input)
                // Check to make sure input hasn't change in the meantime
                if (input !== this.state.locationNameInput) {
                    return
                }
                this.setState({
                    autocompletions: _.uniq(
                        Array.from(results.objects),
                        false,
                        ({name, state}) => name + state
                    ),
                });
            } catch (error) {
                console.error(
                    "Error trying to get location autocomplete",
                    error
                )
            }
        }
        this.setState({
            autocompletionInProgress: false,
        });
    }

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
        if (this._search &&
            this._search === document.activeElement &&
            prevState.autocompletions != this.state.autocompletions) {
            this.scrollToSearchControl();
        }
    }

    /*::__(){`*/@debounce(500)/*::`}*/
    scrollToSearchControl(): void {
        if (this._search) {
            // Scroll the input to just under the appbar
            window.scrollTo(0, this._search.offsetTop - 40);
        }
    }

    onSearchChange(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.setState({
                locationNameInput: event.target.value.replace(/^\s+/, ""),
                autocompletionInProgress: true,
            });

            this.clearSelectedLocation();

            this.triggerAutocomplete();
        }
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

    render: (() => React.Element<"div">) = () => (
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
                        <div className="search"
                            id="searchBar"
                        >
                            <input
                                type="search"
                                ref={element => {
                                    this._search = element;
                                }}
                                onFocus={
                                    this.scrollToSearchControl.bind(this)
                                }
                                aria-label="Search for a suburb
                                 or postcode"
                                placeholder="Search for a suburb
                                 or postcode"
                                value={this.state.locationNameInput}
                                onChange={this.onSearchChange.bind(this)}
                            />
                            {
                                this.state.locationNameInput &&
                                <FlatButton
                                    className="clear-text"
                                    label="&times;"
                                    aria-label="Clear entered location"
                                    prompt="Clear"
                                    onClick={() => {
                                        this.clearSelectedLocation()
                                        this.clearLocationInput()
                                    }}
                                />
                            }
                        </div>
                        {this.state.autocompletions.length > 0 &&
                            <ul
                                className="locationList"
                                role="listbox"
                            >
                                {
                                    /* any autocompletions we currently have */
                                    this.state.autocompletions.map(
                                        (result, index) =>
                                            <li
                                                className="locationItem"
                                                key={index}
                                                role="option"
                                                aria-label={`${result.name},
                                                ${result.state}`}
                                                tabIndex={0}
                                                onClick={
                                                    this.selectAutocomplete
                                                        .bind(
                                                            this,
                                                            result,
                                                        )
                                                }
                                            >
                                                <div className="suburb">
                                                    {result.name}
                                                </div>
                                                <div className="state">
                                                    {result.state}
                                                </div>
                                            </li>
                                    )
                                }
                            </ul>
                        }
                        {
                            this.state.autocompletionInProgress && (
                                <div
                                    className="progress"
                                    tabIndex="0"
                                >
                                    <ScreenReader>
                                        Loading locations
                                    </ScreenReader>
                                    <icons.Loading className="big" />
                                </div>
                            )
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

    renderDoneButton(): React.Element<"div"> {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label="Done"
                        className="doneButton"
                        onClick={this.onDoneTouchTap.bind(this)}
                        disabled={this.state.nextDisabled}
                        form="searchBar"
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
