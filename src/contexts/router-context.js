/* @flow */
// Router Context
// Provide a single standard interface for accessing/modifying anything
// related to routing. This context is provided for all routes so it's available
// pretty much everywhere. It might be nice if we could just use the
// react-router hooks directly where needed in different components but the
// Ask Izzy codebase is currently a mix of class and functional components.
// Plus we can also use this router context to provide other relevant info that
// react-router doesn't provide and serve all this info with whatever structure
// we like. Which means if react-router completely overhauls their interface yet
// again (you think by version 6 they'd have at least the core interface fairly
// stable by now but no :/) we can theoretically change the plumbing here
// without having to change every component that interacts with the router.

import * as React from "react";
import {useContext, useEffect} from "react";
import {
    useLocation,
    useNavigate,
    NavigateFunction,
    Location,
} from "react-router-dom";
import RouteMatch from "react-router"
import storage from "../storage"

export type RouterContextObject = {
    router: {
        navigate: typeof NavigateFunction,
        navigateInProgress: function,
        location: typeof Location,
        match: {
            props: Object,
            params: Object,
        },
    }
}

const RouterContext = (
    React.createContext<Object>(): React$Context<RouterContextObject>
);

export default RouterContext

type InjectRouterContextProps = {
    matchedRoutes: Array<typeof RouteMatch>,
    children: React.Node
}

export const InjectRouterContext = (
    {matchedRoutes, children}: InjectRouterContextProps
): React.Node => {
    const {navigate, navigateInProgress} = getNavigateFunctions()
    const matchedRoute = matchedRoutes.pop()

    // if a search value is in the URL but not stored, set the search
    // text in storage.
    if (!storage.getSearch() && matchedRoute.params.search) {
        storage.setSearch(matchedRoute.params.search, {eventValue: 0})
    }

    const context = {
        router: {
            navigate,
            navigateInProgress,
            location: useLocation(),
            match: {
                props: extractRouteProps(matchedRoute),
                params: matchedRoute.params,
            },
        },
    }

    return (
        <RouterContext.Provider value={context}>
            {children}
        </RouterContext.Provider>
    )
}

export const useRouterContext =
    (): $PropertyType<RouterContextObject, 'router'> =>
        useContext(RouterContext).router

function extractRouteProps(routeConfig) {
    return {...routeConfig.route.element.props}
}

function getNavigateFunctions() {
    let navigate = useNavigate()
    navigate = wrapNavigateWithBackInternalOnly(navigate)
    const {navigateWhenReady, navigateInProgress} = wrapNavigateWithWhenReady(
        navigate
    )
    navigate = wrapNavigateWithSupportExternal(navigateWhenReady)
    return {
        navigate,
        navigateInProgress,
    }
}

/*
If an attempt is make to go back to a previous page and there either isn't a
previous page or it's an external website, go to the home page instead.
*/
function wrapNavigateWithBackInternalOnly(navigate) {
    const location = useLocation()
    return (...args) => {
        const to = args[0]
        if (typeof to === "number" && to < 0 && location.key === "default") {
            navigate("/")
        } else {
            navigate(...args)
        }
    }
}

/*
If the address to navigate to is a full URL then it's most likely an external
link. The standard navigate function doesn't support external links so catch
and manually navigate to.
*/
function wrapNavigateWithSupportExternal(navigate) {
    return (...args) => {
        const to = args[0]
        if (typeof to === "string") {
            try {
                new URL(to)
                document.location.href = to
                return
            } catch (error) {
                // We know "to" is a string but since "new URL(to)" has failed
                // it is is not a valid URL and is presumably an internal link
                // (ie just the pathname). We can therefore we can safely use
                // the navigate() function.
            }
        }

        return navigate(...args)
    }
}

/*
The navigate function in react router won't let you call it's self until a
component has been rendered. So we create a wrapper to either call it
immediately if it's possible to do so or we store the request and call
navigate later.
*/
let navigateArgs
function wrapNavigateWithWhenReady(navigate) {
    let ready = false

    useEffect(() => {
        ready = true;
        if (navigateArgs) {
            navigate(...navigateArgs)
            navigateArgs = null
        }
    })

    return {
        navigateWhenReady(...args) {
            if (ready) {
                navigate(...args)
            } else {
                navigateArgs = args
            }
        },
        navigateInProgress() {
            return !!navigateArgs
        },
    }
}
