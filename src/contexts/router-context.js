/* @flow */
import React from "react";
import { withRouter } from "react-router";
import storage from "../storage";
const RouterContext = React.createContext<Object>();

export default RouterContext

export const InjectRouterContext = withRouter(
    ({children, history, location, matchedRoute}) => {
        const context = {
            router: {
                history,
                location,
                match: matchedRoute,
            },
        }

        // if a search value is in the URL but not stored, set the search
        // text in storage.
        if (!storage.getSearch() && matchedRoute.params.search) {
            storage.setSearch(matchedRoute.params.search)
        }

        return (
            <RouterContext.Provider value={context}>
                {children}
            </RouterContext.Provider>
        )
    }
)
