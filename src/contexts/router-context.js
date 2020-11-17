/* @flow */
import React from "react";
import { withRouter } from "react-router";
import { Switch } from "react-router-dom";

const RouterContext = React.createContext<Object>();

export default RouterContext

export const InjectRouterContext = withRouter(
    ({children, history, location, matchedRoute, routes}) => {
        const context = {
            router: {
                history,
                location,
                match: {
                    props: getRouteProps(routes, matchedRoute),
                    ...matchedRoute,
                },
                currentlyRedirecting: () => 
                    typeof window !== "undefined" &&
                    matchedRoute?.url !== decodeURI(window.location.pathname),
                staticRender: typeof window === "undefined",
            },
        }
        return (
            <RouterContext.Provider value={context}>
                {children}
            </RouterContext.Provider>
        )
    }
)

function getRouteProps(routes, routeMatch): Object {
    // Routes are nested components so flatten out and extract just the props
    // for each route
    function extractRouteInfo(routes): Array<Object> {
        if (routes instanceof Array) {
            return routes
                .map(subRoutes => extractRouteInfo(subRoutes)).flat()
        } else if (routes.type === Switch) {
            return routes.props.children
                .map(subRoutes => extractRouteInfo(subRoutes)).flat()
        } else if (routes.props) {
            return routes.props
        }
        return []
    }
    const routesInfo = extractRouteInfo(routes)

    return routesInfo.find(route => route.path === routeMatch.path)
}
