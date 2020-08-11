/* @flow */
import React from "react";
import { withRouter } from "react-router";
import routes from "../routes";
import {Redirect, Switch} from "react-router-dom";

const RouterContext = React.createContext<Object>();

export default RouterContext

export const InjectRouterContext = withRouter(
    ({children, history, location, matchedRoute}) => {
        const context = {
            router: {
                history,
                location,
                match: {
                    props: getRouteProps(matchedRoute),
                    ...matchedRoute,
                }
            },
        }
        return (
            <RouterContext.Provider value={context}>
                {children}
            </RouterContext.Provider>
        )
    }
)



function getRouteProps(routeMatch): Object {
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
