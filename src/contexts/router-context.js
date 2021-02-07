/* @flow */
import React from "react";
import { withRouter } from "react-router";

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
        return (
            <RouterContext.Provider value={context}>
                {children}
            </RouterContext.Provider>
        )
    }
)
