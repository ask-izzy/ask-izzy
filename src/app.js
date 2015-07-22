// Support material-ui until react 1.0
// see http://material-ui.com/#/get-started
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import Fluxible from "fluxible";
import { RouteStore } from "fluxible-router";

import routes from "./routes";

import Application from "./Application";
import HtmlHeadStore from "./stores/HtmlHeadStore";

// Create the fluxible app using Application as root component
const app = new Fluxible({ component: Application });

// Register a fluxible RouteStore
const AppRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(AppRouteStore);
app.registerStore(HtmlHeadStore);

export default app;
