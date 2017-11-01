/* @flow */

import React from "react";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";
import storage from "../storage";
import sendEvent from "../google-tag-manager";

import AppBar from "../components/AppBar";
import ButtonListItem from "../components/ButtonListItem";
import ResultsMap from "../components/ResultsMap";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsListPage from "./ResultsListPage";

class ResultsPage extends BaseCategoriesPage {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    issParams(): ?Object {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        let request = this.search;

        for (let item of this.personalisationComponents) {
            if (typeof item.getSearch == "function") {
                request = item.getSearch(request);

                if (!request) {
                    return null;
                }
            }
        }

        return request;
    }

    componentDidMount(): void {
        super.componentDidMount();

        sendEvent({
            event: "searchResults",
            searchQuery: this.props.params.search,
            searchPage: this.props.params.page,
            location: storage.getLocation(),
        });

        const request = this.issParams();

        if (!request) {
            const sep = this
                .props
                .location
                .pathname
                .endsWith("/") ? "" : "/";

            this.context.router.replace(
                `${this.props.location.pathname}${sep}personalise`
            );
            return;
        }

        if ("indigenous_classification" in request) {
            /*
                The order in which results must be loaded is:
                1) indigenousespecific
                2) culturallysafeforaboriginal
                3) mainstreamwhocaterforaboriginal
                4) mainstream (services non-aboriginal oriented)

                The load order exhaust all relevant results on each category
                before rendering the next one. Loading 10 results at a time
                for a maximun of 100 results.

                During a load cycle we might run on instances where we have
                received 10 new results and we can only load some of them,
                on this case we will load as many as we can and store the
                the rest. During the next load cycle we will first try
                to load saved results before requesting more.

                ISS3 allows us to load more results by providing an url on
                request.meta.next if this url is not returned then we have
                no more results to load. Each call to this url will return
                the prvious set plus 10 more sults (less if not available)
            */
            let atsi1 = Object.assign({}, request);
            let atsi2 = Object.assign({}, request);
            let atsi3 = Object.assign({}, request);
            let atsi4 = Object.assign({}, request);

            // atsi1 is the default search for aboriginal specific.
            atsi2.indigenous_classification = 'culturallysafeforaboriginal';
            atsi3.indigenous_classification =
                'mainstreamwhocaterforaboriginal';
            atsi4.indigenous_classification = 'mainstream';

            let issPromises = [
                iss.search(atsi1),
                iss.search(atsi2),
                iss.search(atsi3),
                iss.search(atsi4),
            ];

            Promise.all(issPromises).then(data => {
                let atsiObjects = [];
                let atsiMeta = Object.assign({}, data[1].meta);
                let availableCount = 0;
                let totalCount = 0;
                let nextExists = false;
                let countLimit = 10;

                for (let iter = 0; iter < data.length; iter++) {
                    // store data and do one category at a time.

                    availableCount += data[iter].meta.available_count;
                    totalCount += data[iter].meta.total_count;

                    // Create a list with the first 10 objects to display and
                    // keep track of the index of leftover objects for
                    // render more.
                    if (atsiObjects.length < 10) {
                        if (data[iter].meta.next) {
                            // If meta.next exists then this atsi response
                            // has 10 results already and more to follow.
                            // We first check if we can add the whole result
                            // set or only a subset. The index metric will
                            // point to the last accessed value.
                            nextExists = true;
                            if (atsiObjects.length == 0) {
                                atsiObjects =
                                    [...atsiObjects, ...data[iter].objects];

                                // Index of the last position of the objects
                                // array, for a lenght of 10 index is 9.
                                // We want index to be a property that only
                                // exists inside the context of atsi results
                                // display this we disable flow.
                                // flow:disable
                                data[iter].meta.index = 9;
                            } else {
                                let availableSpaces = 10 - atsiObjects.length;

                                for (let pos = 0; pos < availableSpaces &&
                                     pos < data[iter].meta.available_count;
                                     pos++) {
                                    atsiObjects.push(data[iter].objects[pos]);
                                    // flow:disable
                                    data[iter].meta.index = pos;
                                }
                            }
                        } else {
                            // If copying the whole result set adds up to less
                            // than 10 objects add them all. Else copy a
                            // subset and include an index metric pointing to
                            // the last accessed spot, this will later be used
                            // to load more results.
                            if ((data[iter].meta.available_count +
                                    atsiObjects.length) <= 10) {
                                atsiObjects =
                                    [...atsiObjects, ...data[iter].objects];
                            } else {
                                let availableSpaces = 10 - atsiObjects.length;

                                for (let pos = 0; pos < availableSpaces &&
                                     pos < data[iter].meta.available_count;
                                     pos++) {
                                    atsiObjects.push(data[iter].objects[pos]);
                                    // flow:disable
                                    data[iter].meta.index = pos;
                                }
                            }
                        }
                    }

                    // If atsiobject list is full assign index of 0 for
                    // unprocessed requests. The next load cycle will start
                    // loading from this position.
                    if (!data[iter].meta.index) {
                        // flow:disable
                        data[iter].meta.index = 0;
                    }
                }

                // Set meta fields for atsi data used for render of
                // load more and loading result header.
                atsiMeta.available_count = availableCount;
                atsiMeta.total_count = totalCount;
                if (nextExists) {
                    atsiMeta.next = nextExists;
                }

                this.setState((prevState, props) => {
                    return {
                        objects: atsiObjects,
                        meta: atsiMeta,
                        atsiRequestData: data,
                        countLimit: countLimit,
                        error: undefined,
                    };
                });
            })
            .catch(response => {
                try {
                    console.error(response, response.stack);

                    let data = JSON.parse(response.body);

                    this.setState({
                        error: data.error_message,
                        statusCode: response.statusCode,
                    });
                } catch (error) {
                    console.log(error)
                    this.setState({
                        error: `An error occurred. Please try again.`,
                        statusCode: response.statusCode,
                    });
                }

            });

        } else {
            iss.search(request)
            .then(data => {
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                    error: undefined,
                });
            })

            .catch(response => {
                try {
                    console.error(response, response.stack);

                    let data = JSON.parse(response.body);

                    this.setState({
                        error: data.error_message,
                        statusCode: response.statusCode,
                    });
                } catch (error) {
                    console.log(error)
                    this.setState({
                        error: `An error occurred. Please try again.`,
                        statusCode: response.statusCode,
                    });
                }

            });
        }
    }


    get loading(): boolean {
        return !(this.state.meta || this.state.error);
    }

    // Can't reduce an async function into sub async functions easily.
    // Aiming to preserve simplicity we increase the Cyclomatic Complexity
    // threshold on ESLint to its default of 20.
    /*eslint complexity: ["error", 20]*/
    async loadMore(): Promise<void> {
        sendEvent({
            event: "LoadMoreSearchResults",
            searchQuery: this.props.params.search,
            searchPage: this.props.params.page,
            location: storage.getLocation(),
        });

        if (!(this.state.meta && this.state.meta.next) ||
                this.state.countLimit == 100) {
            return;
        }

        if (this.state.atsiRequestData) {
            // Itearate through all atsi request data and first load
            // un-rendered results starting from index before requesting
            // additional objects via meta.next query string.

            let data = this.state.atsiRequestData;
            let atsiObjects = this.state.objects;

            // Flow lint complains this property is not declared even when
            // the property is declared on state constructor.
            // flow:disable
            let countLimit = this.state.countLimit + 10;
            let atsiMeta = this.state.meta;

            // We are only interested in the truth value for next to use
            // it as display logic for the "load more" buttom.
            atsiMeta.next = '';

            for (let iter = 0; iter < data.length; iter++) {
                if (atsiObjects && atsiObjects.length < countLimit) {
                    // First render already loaded results if we have any.
                    if ((data[iter].meta.index &&
                        data[iter].meta.index !=
                            data[iter].objects.length - 1) ||
                            data[iter].meta.index == 0) {

                        // Start loading from the next value after the last
                        // element accessed during the previous render cycle.
                        let index = data[iter].meta.index;
                        let availableSpaces = countLimit - atsiObjects.length;

                        if (index != 0) {
                            index++;
                        }

                        for (let pos = 0;
                                pos < availableSpaces &&
                                index < data[iter].objects.length; pos++) {

                            atsiObjects.push(data[iter].objects[index]);
                            data[iter].meta.index = index++;
                        }
                    }

                    // If index has caped with all available loaded objects,
                    // request more objects and load if space is available.
                    if (data[iter].meta.next &&
                        data[iter].meta.index ==
                            data[iter].objects.length - 1 &&
                            data[iter].meta.next) {

                        let next = data[iter].meta.next;
                        let newData;

                        // Load new  data.

                        // Reenable the search spinner by clearing state.meta
                        // and re-enabling.
                        this.setState({meta: null});

                        try {
                            // Get index data before overriding with new
                            // results.
                            let index = data[iter].meta.index;

                            data[iter] = await iss.requestObjects(next);
                            data[iter].meta.index = index;

                            // Start loading from the next value
                            // after the last element accessed
                            // during the previous render cycle.
                            index = data[iter].meta.index + 1;
                            let availableSpaces =
                                countLimit - atsiObjects.length;

                            for (let pos = 0;
                                    pos < availableSpaces &&
                                    index < data[iter].objects.length;
                                    pos++) {

                                atsiObjects.push(data[iter].objects[index]);
                                data[iter].meta.index = index++;
                            }

                            // Allow the load more buttom to be available if
                            // we have meta.next or if we have undendered
                            // loaded services.
                            if (data[iter].meta.next ||
                                data[iter].meta.index !=
                                    data[iter].objects.length) {
                                atsiMeta.next = 'true';
                            }
                            this.setState({
                                error: undefined,
                            });

                        } catch (response) {
                            try {
                                newData = JSON.parse(response.body);
                                this.setState({
                                    error: newData.error_message,
                                });
                            } catch (error) {
                                this.setState({
                                    error: `An error occurred (${
                                        response.statusCode || error
                                    })`,
                                    statusCode: response.statusCode,
                                });
                            }
                        }
                    }

                }
            }

            // Reset component state after processing additions.
            this.setState((prevState, props) => {
                return {
                    objects: atsiObjects,
                    meta: atsiMeta,
                    atsiRequestData: data,
                    countLimit: countLimit,
                };
            });

        } else {
            let next = this.state.meta.next;
            let data;

            /* reenable the search spinner */
            this.setState({meta: null});

            try {
                data = await iss.requestObjects(next);
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                    error: undefined,
                });

            } catch (response) {
                try {
                    data = JSON.parse(response.body);
                    this.setState({
                        error: data.error_message,
                    });
                } catch (error) {
                    this.setState({
                        error: `An error occurred (${
                            response.statusCode || error
                        })`,
                        statusCode: response.statusCode,
                    });
                }
            }
        }
    }

    onBackClick(event: SyntheticInputEvent): void {
        if (this.refs.component.onGoBack) {
            this.refs.component.onGoBack(event)
        }

        if (!event.defaultPrevented) {
            this.context.router.push(
                "/",
            );
        }
    }

    component(): ReactClass<any> {
        throw new Error("Override this class to implement `component`");
    }

    render() {
        const Component = this.component();

        return (
            <div className="ResultsPage">
                <AppBar
                    title={this.title}
                    backMessage={this.backButtonMessage()}
                    onBackTouchTap={this.onBackClick.bind(this)}
                />
                <DebugContainer message="Debug personalisation">
                    <DebugPersonalisation
                        search={this.search}
                        items={this.personalisationComponents}
                    />
                </DebugContainer>
                <DebugContainer message="ISS Parameters">
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>

                <Component
                    ref="component"
                    {...this.state}
                    {...this.props}
                    category={this.category}
                    search={this.props.params.search}
                    loadMore={this.renderLoadMore()}
                    title={this.title}
                    loading={this.loading}
                    personalisationComponents={this.personalisationComponents}
                />
            </div>
        );
    }

    renderLoadMore() {
        if (this.state.meta && this.state.meta.next &&
            this.state.countLimit != 100) {
            return (
                <ButtonListItem
                    className="MoreResultsButton"
                    primaryText="Load more results…"
                    onClick={this.loadMore.bind(this)}
                />
            );
        }

        if (this.loading) {
            return (
                <div className="progress">
                    <icons.Loading className="big" />
                </div>
            );
        }
    }

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }

}

export default ResultsPage;

export class ResultsPageListing extends ResultsPage {

    component(): ReactClass<any> {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Categories"
    }
}

export class ResultsPageMap extends ResultsPage {

    component(): ReactClass<any> {
        return ResultsMap;
    }
}
