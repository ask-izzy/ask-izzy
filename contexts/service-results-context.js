/* @flow */
import React, {useContext, createContext, useState, useEffect, useReducer} from "react";
import type {Node as ReactNode} from "react";
import type { NextRouter } from "next/router"
import { useRouter } from "next/router"

import Service from "@/src/iss/Service"
import {
    PaginatedSearch,
} from "@/src/iss/serviceSearch";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading"
import type {SortType} from "@/src/components/base/Dropdown"
import type {travelTimesStatus as travelTimesStatusType} from "@/src/hooks/useTravelTimesUpdater"
import storage from "@/src/storage"
import {
    getCategoryFromRouter,
    getPageTitleFromRouter,
    getPersonalisationNextPath,
} from "@/src/utils/routing"

type Context = {
    search: PaginatedSearch | null,
    setSearch: (PaginatedSearch | null) => void,
    travelTimesStatus: ?travelTimesStatusType,
    setTravelTimesStatus: (travelTimesStatusType | null) => void,
}

const ServiceResultsContext: React$Context<Context> = createContext<Context>(
    {
        search: null,
        setSearch: () => {},
        travelTimesStatus: null,
        setTravelTimesStatus: () => {},
    }
)

type ProviderProps = {
    children: ReactNode,
}

export const ServiceResultsProvider = (
    {children}: ProviderProps
): ReactNode => {
    const [search, setSearch] = useState<PaginatedSearch | null>(null)
    const [travelTimesStatus, setTravelTimesStatus] = useState<travelTimesStatusType | null>(null)

    const context = {
        search,
        setSearch,
        travelTimesStatus,
        setTravelTimesStatus,
    }
    return (
        <ServiceResultsContext.Provider value={context}>
            {children}
        </ServiceResultsContext.Provider>
    )
}

export const useServiceResultsContext = (): Context => useContext(ServiceResultsContext)