/* @flow */

import * as React from "react";
import { debounce } from "lodash-decorators";
import { ltrim } from "underscore.string";
import _ from "underscore";

import {geolocationAvailable} from "../../geolocation";
import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import Category from "../../constants/Category";
import WithStickyFooter from "../../components/WithStickyFooter";

type Props = {
        name: string,
        onDoneTouchTap: Function,
}

type State = {
        autocompletionInProgress: boolean,
        locationName: string,
        autocompletions: Array<issArea>,
        nextDisabled: boolean,
        showStepper: boolean,
        category: ?Category,
}

class Location extends Personalisation<Props, State> {
    static defaultProps: any = {
        name: "location",
    };

    _search: ?HTMLInputElement;

    constructor(props: Object) {
        super(props);
        this.state = {
            autocompletionInProgress: false,
            locationName: "",
            autocompletions: [],
            nextDisabled: true,
            showStepper: false,
            category: undefined,
        };
    }

    componentDidMount(): void {
        this.setLocationName(
            storage.getLocation(),
            storage.getLocation() != "" // valid location
        );
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
    static title: any = "Location";

    static headingValue(): ?string {
        return this.answer && `in ${this.answer}`
    }

    static get answer(): string {
        return storage.getLocation();
    }

    static breadcrumbAnswer(): ?any {
        return this.answer;
    }

    static shouldInjectAccessPoints(): boolean {
        // Currently only for locations in Victoria.
        let victoriaRegex = /VIC(toria)?$/i;

        return !!victoriaRegex.exec(storage.getLocation());
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        /* Coordinates are optional */
        let coords = storage.getCoordinates();

        if (coords && coords.latitude && coords.longitude) {
            request = Object.assign(request, {
                location: `${coords.longitude}E${coords.latitude}N`,
            });
        }

        /* Location/Area is required */
        let location = storage.getLocation();

        if (!location) {
            return null;
        }

        request = Object.assign(request, {area: location});

        return request;
    }

    static summaryLabel: any = "Where are you?";

    static get summaryValue(): string {
        return storage.getLocation();
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
    triggerAutocomplete(): void {
        let input = this.state.locationName;

        iss.getLocations(input)
            .then(results => {
                this.setState({
                    autocompletions: _.uniq(
                        Array.from(results.objects),
                        false,
                        ({name, state}) => name + state
                    ),
                    autocompletionInProgress: false,
                });
            })

            .catch(() => {
                this.setState({
                    autocompletionInProgress: false,
                });
            });
    }

    setLocationName(name: any, validChoice: boolean): void {
        this.setState({
            locationName: `${name || ""}`,
        });
        this.setState({nextDisabled: !(name && validChoice)});
    }

    onNextStep(): void {
        storage.setLocation(this.state.locationName || "");
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
            this.setLocationName(ltrim(event.target.value), false);
            this.setState({
                autocompletionInProgress: true,
            });

            // Forget the users coordinates if they change
            // the location we detected
            storage.setCoordinates(null);

            this.triggerAutocomplete();
        }
    }

    onGeoLocationSuccess(params: {coords: Coordinates, name: string}): void {
        storage.setCoordinates(params.coords);
        this.setLocationName(params.name, true);
    }

    selectAutocomplete(result: issArea): void {
        /* set the text box to this value
         * and remove the autocompletions */
        let locationName =
            `${result.name}, ${result.state}`;

        this.setLocationName(locationName, true);
        this.setState({
            autocompletions: [],
        });
    }

    render: (() => React.Element<"div">) = () => (
        <div className="Location">
            {this.renderHeaderBar()}

            <WithStickyFooter
                footerContents={this.renderDoneButton()}
            >
                <div className="List">
                    {
                        /* if the browser supports geolocation */
                        geolocationAvailable() &&
                        <components.GeolocationButton
                            onSuccess={this.onGeoLocationSuccess.bind(this)}
                        />
                    }

                    <div className="search"
                        id="searchBar"
                    >
                        <input
                            type="search"
                            ref={element => {
                                this._search = element;
                            }}
                            onFocus={this.scrollToSearchControl.bind(this)}
                            aria-label="Search for a suburb or postcode"
                            placeholder="Search for a suburb or postcode"
                            value={this.state.locationName}
                            onChange={this.onSearchChange.bind(this)}
                        />
                    </div>

                    {
                        /* any autocompletions we currently have */
                        this.state.autocompletions.map((result, index) =>
                            <components.InputListItem
                                key={index}
                                primaryText={
                                    <div className="suburb">
                                        {result.name}
                                    </div>
                                }
                                secondaryText={
                                    <div className="state">
                                        {result.state}
                                    </div>
                                }
                                type="radio"
                                tabIndex={0}
                                uncheckedIcon={
                                    <icons.RadioUnselected className="big" />
                                }
                                checkedIcon={
                                    <icons.RadioSelected className="big" />
                                }
                                onClick={
                                    this.selectAutocomplete.bind(this, result)
                                }
                            />
                        )
                    }
                </div>
                {
                    this.state.autocompletionInProgress && (
                        <div className="progress">
                            <icons.Loading className="big" />
                        </div>
                    )
                }
            </WithStickyFooter>
        </div>
    );

    renderDoneButton(): React.Element<"div"> {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label="Done"
                        onClick={this.onDoneTouchTap.bind(this)}
                        disabled={this.state.nextDisabled}
                        form="searchBar"
                    />
                </div>
            </div>
        )
    }

    renderHeaderBar(): React.Element<any> {
        const renderedHeaderBar = (
            <components.HeaderBar
                primaryText={
                    <div>
                        Where are you?
                    </div>
                }
                secondaryText={
                    "This will let me find the services closest to you"
                }
                taperColour={this.state.showStepper ? "LighterGrey"
                    : "HeaderBar"}
                bannerName={this.bannerName}
            />
        )
        if (this.state.showStepper) {
            return (
                <section className="page-header-section">
                    {renderedHeaderBar}
                    <QuestionStepper
                        category={this.state.category}
                    />
                </section>
            )
        } else {
            return renderedHeaderBar
        }
    }
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
