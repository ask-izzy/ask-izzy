import React, {useContext, createContext, useState, ReactNode} from "react";

import {
    PaginatedSearch,
} from "@/src/iss/serviceSearch.js";
import type {travelTimesStatus as travelTimesStatusType} from "@/src/hooks/useTravelTimesUpdater.js"


type Context = {
    search: PaginatedSearch | null,
    setSearch: (search: PaginatedSearch | null) => void,
    travelTimesStatus: travelTimesStatusType | null,
    setTravelTimesStatus: (travelTimesStatus: travelTimesStatusType | null) => void,
}

const ServiceResultsContext = createContext<Context>(
    {
        search: null,
        setSearch: () => undefined,
        travelTimesStatus: null,
        setTravelTimesStatus: () => undefined,
    },
)

type ProviderProps = {
    children: ReactNode,
}

export const ServiceResultsProvider = (
    {children}: ProviderProps,
) => {
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