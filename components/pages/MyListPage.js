/* @flow */

import React, {useEffect, useState, useRef} from "react";
import type {Node as ReactNode} from "react";
import { useRouter } from "next/router"

import HeaderBar from "@/src/components/HeaderBar"
import MyListResults from "@/src/components/MyListResults"
import Button from "@/src/components/base/Button"
import Loading from "@/src/icons/Loading"
import ScrollToTop from "@/src/components/ResultsListPage/ScrollToTop"
import ShareButton from "@/src/components/ShareButton"
import storage from "@/src/storage"
import classnames from "classnames";
import {MobileDetect} from "@/src/effects/MobileDetect";
import Spacer from "@/src/components/Spacer";
import {getService} from "@/src/iss/load-services"
import ToastMessageMyList from "@/src/components/ToastMessageMyList"
import Service from "@/src/iss/Service"
import ClearMyListDialog from "@/src/components/ClearMyListDialog"

type myListArrayType = Array<[string, Service, number]>
type cacheType = {string: Object}

function MyListPage(): ReactNode {
    const router = useRouter()
    const isMobile = MobileDetect(500)
    const [myListArray, setMyListArray] = useState<myListArrayType>([])
    const [cache, setCache] = useState<cacheType>({})
    const [openClearAllDialog, setOpenClearAllDialog] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [serviceCount, setServiceCount] = useState<number>(0)

    // ref is to fix the stale closure issue
    // caused by updateServices callback
    // fix requires using a ref and a useState hook
    // https://stackoverflow.com/questions/
    // 62806541/how-to-solve-the-react-hook-closure-issue
    // this ref is read only except for useEffect hook
    const cacheRef = useRef<cacheType>({});

    const jsonStorageObj = "my-list-services"
    const uniqueStorageSubscriptionKey = "myListUndoKey"

    useEffect(() => {
        getInitialServices()
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, [])

    const [selectedServices, setSelectedServices] = useState<Array<Service>>([])

    useEffect(() => {
        cacheRef.current = cache
    }, [cache])

    useEffect(() => {
        // update selectedServices to share services
        setSelectedServices(
            myListArray
                .map(serviceData => new Service(serviceData[1]))
        )
    }, [myListArray])

    function subscribeToJsonChange() {
        storage.subscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey, updateServices)
        return function cleanup() {
            storage.unsubscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey)
        };
    }

    const getInitialServices = async() => {
        const myCurrentList = storage.getJSON(jsonStorageObj)
        let obj = {}

        if (myCurrentList) {
            obj = await getServiceObjs(myCurrentList)
        }

        updateServices(obj)
        setCache(obj)
    }

    const updateServices = (initialLoadObj) => {
        let myCurrentList = storage.getJSON(jsonStorageObj)
        let myListServices
        if (initialLoadObj) {
            // only executed when component is mounted
            myListServices = initialLoadObj
            setIsLoading(false)
        } else {
            // update services
            myListServices = storage.getJSON(jsonStorageObj)
            for (let key of Object.keys(myListServices)) {
                myListServices[key] = cacheRef.current[key]
            }
        }

        setMyListArray(
            sortServicesArray(
                myListServicesToArray(myListServices, myCurrentList)

            )
        )
        setServiceCount(Object.keys(myCurrentList).length)
    }

    function myListServicesToArray(myListServices, myCurrentList) {
        const array = []
        for (let key in myListServices) {
            array.push([key, myListServices[key], myCurrentList[key]])
        }
        return array
    }

    function sortServicesArray(servicesArray) {
        let sortedServicesArray = servicesArray.sort((a, b) => {
            return Number(b[2]) - Number(a[2])
        });

        return sortedServicesArray
    }

    async function getServiceObjs(myCurrentList) {
        const services = {}
        // get service information from ISS
        const myListArray = await Promise.all(Object.keys(myCurrentList).map(async id => {
            const serviceObj = await getService(Number(id));
            return serviceObj
        }));

        for (let item of myListArray) {
            services[item.id] = item
        }

        return services
    }

    function renderInformationText() {
        return (
            <div className="information-container">
                <div className="information-text">
                    <h2>How long will services stay in My List?</h2>
                    <div>
                        Services will be kept here until you remove them or your browsing history is cleared.
                    </div>
                    <br/>
                    <div>
                        Why not send the services on this list to
                        yourself now?
                    </div>
                    <br/>
                    <ShareButton
                        hasTextDescription={true}
                        services={selectedServices}
                    />
                </div>
            </div>

        )
    }

    function renderResults() {
        if (isLoading) {
            return (
                <div className="progress">
                    <Loading className="big" />
                </div>
            )
        } else if (serviceCount == 0) {
            return (
                <div className="empty-list-container">
                    <h2>
                        Your list is empty
                    </h2>
                    <div>
                        Search Ask Izzy to add services here.
                    </div>
                    <Button onClick={() => router.push("/")}
                        className="back-to-home"
                    >
                        Search for services
                    </Button >
                </div>
            )
        } else {
            return (
                <div className="my-list-results-container">
                    <MyListResults
                        results={myListArray}
                        resultsLoading={isLoading}
                        travelTimesStatus={"loaded"}
                    >
                        {renderInformationText()}
                    </MyListResults>
                </div>
            )
        }

    }
    function renderTopButtonContainer() {
        return (
            <div className={classnames("top-button-container", {"web": !isMobile})}>
                <div className={classnames("count-container", {"mobile": isMobile})}>
                    {`${serviceCount} service${serviceCount > 1 ? "s" : ""} in your list`}
                    {isMobile &&
                        <ShareButton
                            hasTextDescription={true}
                            services={selectedServices}
                        />}
                </div>

                {isMobile && <Spacer />}
                <div className={classnames("clear-all-container", {"mobile": isMobile})}>
                    <Button className={classnames("clear-all", {"mobile": isMobile})}
                        onClick={() => {
                            setOpenClearAllDialog(true)
                        }}
                    >
                        Clear all
                    </Button>
                    {!isMobile &&
                        <ShareButton
                            hasTextDescription={true}
                            services={selectedServices}
                        />
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="MyListPage">
            <div>
                <HeaderBar
                    className="serviceDetailsHeader"
                    primaryText={"My List"}
                    secondaryText={"Add services to this page to create a list you can share"}
                    infoText={"Services on this page will only remain here temporarily"}
                    bannerName="housing"
                />
                {serviceCount !== 0 && renderTopButtonContainer()}

            </div>
            {renderResults()}
            <ScrollToTop label="To top"/>
            <ToastMessageMyList
                uniqueStorageSubscriptionKey="myListPageUndoKey"
                isUndo={true}
            />
            {
                openClearAllDialog &&
                <ClearMyListDialog
                    onCloseRequested={() => setOpenClearAllDialog(false)}
                    onClearMyList={() => {
                        storage.setJSON(
                            "my-list-services", {}
                        ),
                        setOpenClearAllDialog(false)
                    }}
                />
            }
        </div>
    );
}

export default MyListPage
