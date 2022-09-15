/* @flow */
import React, {useContext, createContext, useState, useEffect, useReducer} from "react";
import type {Node as ReactNode} from "react";
import Service from "@/src/iss/Service"
import {getService} from "@/src/iss/load-services"
import storage from "@/src/storage"

type Context = {
    myList: Array<Service>,
    setMyList: (Array<Service>) => void,
    isLoading: boolean,
}

const MyListContext: React$Context<Context> = createContext<Context>(
    {
        myList: [],
        setMyList: () => {},
        isLoading: true,
    }
)

type ProviderProps = {
    children: ReactNode,
    initialMyListArray?: Array<Service>
}

export const MyListProvider = (
    {children, initialMyListArray}: ProviderProps
): ReactNode => {
    const [myList, setMyList] = useState<Array<Service>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const previousJsonStorageObj = "my-list-services"
    const arrayStorage = "my-list-services-array"
    
    useEffect(() => {
        getInitialMyListState()
    }, [])

    async function getInitialMyListState() {

        var servicesIdArray = storage.getArray(arrayStorage)
        var servicesArray = []

        // transform previous My List storage system(object) into new My List storage system(array)
        const previousServicesObject = storage.getJSON(previousJsonStorageObj)
        if (previousServicesObject && Object.keys(previousServicesObject).length) {
            const sortedPreviousServicesArray =
                Object.keys(previousServicesObject).sort((a, b) => {
                    return Number(previousServicesObject[b]) - Number(previousServicesObject[a])
                });
            const combinedServicesArray = [...servicesIdArray, ...sortedPreviousServicesArray]
            servicesIdArray = combinedServicesArray.filter(
                (serviceId, index) => combinedServicesArray.indexOf(serviceId) === index
            )
            storage.setJSON(previousJsonStorageObj, {})
        }

        // get services from ISS
        if (servicesIdArray) {
            servicesArray = await getServiceFromISS(servicesIdArray)
        } else {
            servicesArray = []
        }
        setIsLoading(false)
        setMyListWrapper(servicesArray)
    }

    async function getServiceFromISS(serviceIdArray) {
        const services = []
        
        // get service information from ISS
        const myListArray = await Promise.all(serviceIdArray.map(async id => {
            const serviceObj = await getService(Number(id));
            return serviceObj
        }))

        return myListArray
    }
    
    function setMyListWrapper(myList: Array<Service>): void {
        storage.setItem(
            arrayStorage, JSON.stringify(myList.map((service) => String(service.id)))
        )
        setMyList(myList)
    }

    const context = {
        myList,
        setMyList: setMyListWrapper,
        isLoading,
    }
    return (
        <MyListContext.Provider value={context}>
            {children}
        </MyListContext.Provider>
    )
}

export const useMyListContext = (): Context => useContext(MyListContext)