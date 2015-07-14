
import { BaseStore } from "fluxible/addons";
import Actions from "../constants/Actions";

const SITE_NAME = "Ask Izzy";
const BASE_URL = "https://askizzy.org.au";

/*
This store listens to fluxible-router's actions and keep
the content for the <head> tag. Used in server/HtmlDocument.js,
and Application.js (to change the document's title)
 */

class HtmlHeadStore extends BaseStore {

    static storeName = "HtmlHeadStore"

    static handlers = {
        [Actions.NAVIGATE_START]: "handleNavigateStart",
        [Actions.NAVIGATE_SUCCESS]: "handleNavigateSuccess",
        [Actions.NAVIGATE_FAILURE]: "handleNavigateFailure",
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.siteName = SITE_NAME;
        this.currentUrl = null;
        this.setInitialState();
    }

    setInitialState() {
        this.title = "Ask Izzy";
        this.description = "Homelessness services directory";
        this.images = [];
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getSiteName() {
        return this.siteName;
    }

    getCurrentUrl() {
        const route = this.dispatcher
            .getStore("RouteStore")
            .getCurrentRoute();
        if (!route) {
            return BASE_URL;
        }

        return `${BASE_URL}${route.get("url")}`;
    }

    getImages() {
        return this.images;
    }

    // Used to get internationalized messages, has access to the IntlStore
    formatMessage(message, values={}) {
        return JSON.stringify([message, values]);
    }

    handleNavigateStart() {
        // Use a loading title when loading the route
        this.title = this.formatMessage("meta.loadingTitle");
        this.emitChange();
    }

    // Set the store content (images, description, title,
    // etc.) according to the received route
    // Remember: route is an immutable object!
    handleNavigateSuccess(route) {

        switch (route.get("name")) {

            case "category":
                const category = route.getIn(["params", "category"]);
                this.title = "Categories - " + category;
            break;

            default:
                this.setInitialState();
            break;
        }

        this.emitChange();
    }

    handleNavigateFailure(error) {
        if (error.statusCode === 404) {
            this.title = this.formatMessage("meta.notFoundTitle");
        } else {
            this.title = this.formatMessage("meta.errorTitle");
        }

        this.emitChange();
    }

}

export default HtmlHeadStore;
