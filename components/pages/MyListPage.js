/* @flow */

import React, {useEffect, useState, useRef} from "react";
import type {Node as ReactNode} from "react";

import HeaderBar from "@/src/components/HeaderBar"
import MyListResults from "@/src/components/MyListResults"
import Button from "@/src/components/base/Button"
import Link from "@/src/components/base/Link"
import Loading from "@/src/icons/Loading"
import ScrollToTop from "@/src/components/ResultsListPage/ScrollToTop"
import ShareButton from "@/src/components/ShareButton"
import storage from "@/src/storage"
import classnames from "classnames";
import {MobileDetect} from "@/src/effects/MobileDetect";
import Spacer from "@/src/components/Spacer";
import {getService} from "@/src/iss/load-services"
import ToastMessageMyList from "@/src/components/ResultsListPage/ToastMessageMyList"

type myListObjType = {string: Object}

function MyListPage(): ReactNode {
    const isMobile = MobileDetect(500)
    const [myListObj, setMyListObj] = useState<myListObjType>({})

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [serviceCount, setServiceCount] = useState<number>(0)
    // ref is to fix the stale closure issue
    // caused by updateServices callback
    // fix requires using a ref and a useState hook
    // https://stackoverflow.com/questions/
    // 62806541/how-to-solve-the-react-hook-closure-issue
    const latestCacheValue = useRef<myListObjType>({});
    const myListObjHelper = useRef<myListObjType>(myListObj)
    const jsonStorageObj = "my-list-services"
    const uniqueStorageSubscriptionKey = "myListUndoKey"

    useEffect(() => {
        getInitialServices()
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, [])

    useEffect(() => {
        myListObjHelper.current = myListObj
    }, [myListObj])

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
        latestCacheValue.current = obj
    }

    const updateServices = (initialLoadObj) => {
        let myCurrentList = {}
        if (initialLoadObj) {
            // only executed when component is mounted
            myCurrentList = initialLoadObj
            setIsLoading(false)
        } else {
            myCurrentList = storage.getJSON(jsonStorageObj)
            if (Object.keys(myCurrentList).length < Object.keys(latestCacheValue.current).length) {
                // item has been removed from list
                for (let key of Object.keys(myCurrentList)) {
                    myCurrentList[key] = latestCacheValue.current[key]
                }
                latestCacheValue.current = myListObjHelper.current
            } else if (Object.keys(myCurrentList).length == Object.keys(latestCacheValue.current).length) {
                // item remove has been undone
                for (let key of Object.keys(myCurrentList)) {
                    myCurrentList[key] = latestCacheValue.current[key]
                }
            }

        }
        setMyListObj(myCurrentList)
        setServiceCount(Object.keys(myCurrentList).length)
    }

    async function getServiceObjs(myCurrentList) {
        const obj = {}
        // get service information from ISS
        const myListArray = await Promise.all(Object.keys(myCurrentList).map(async id => {
            const serviceObj = await getService(Number(id));
            return serviceObj
        }));

        for (let item of myListArray) {
            obj[item.id] = item
        }

        return obj
    }

    const undoLastChange = () => {
        const myCurrentList = storage.getJSON(jsonStorageObj)
        if (myCurrentList) {
            let removedServices = {}

            // find removed item
            for (let key in latestCacheValue.current) {
                if (!Object.keys(myCurrentList).includes(key)) {
                    removedServices[key] = true;
                }
            }
            // add item to current list
            // due to how the state management is set up,
            // when changing the storage, an instant callback is
            // called, which does not let the setMyListObj update
            // so we need to update the myListObjHelper hook directly and
            // let the updateService callback set setMyListObj state
            myListObjHelper.current = latestCacheValue.current
            storage.setJSON(
                "my-list-services", {...myCurrentList, ...removedServices}
            )
        }
    }

    function renderInformationText() {
        return (
            <div className="information-container">
                <div className="information-text">
                    <h2>How long will services stay in My List?</h2>
                    <div>
                        Services will be kept here for XXXXX. If you clear
                        your browsing history the services from My List will
                        be removed.
                    </div>
                    <br/>
                    <div>
                        Why not send the services on this list to
                        yourself now?
                    </div>
                    <br/>
                    <ShareButton hasTextDescription={true}/>
                </div>
                {renderSaveList("bottom")}
            </div>

        )
    }
    function renderSaveList(position, className) {
        return (
            <div className={classnames("save-list", position, className)}>
                Would you like to save this list?
                <Button className="save-list-button"
                    aria-label="Save this list forever"
                >
                    Yes
                </Button>
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
                    <Link to="/"
                        className="back-to-home-link"
                    >
                        Search for services
                    </Link >
                </div>
            )
        } else {
            return (
                <div className="my-list-results-container">
                    <MyListResults
                        results={myListObj}
                        resultsLoading={isLoading}
                        travelTimesStatus={"loaded"}
                        extraInformation = {renderSaveList}
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
                    {isMobile && <ShareButton hasTextDescription={true}/>}
                </div>

                {isMobile && <Spacer />}
                <div className={classnames("clear-all-container", {"mobile": isMobile})}>
                    <Button className={classnames("clear-all", {"mobile": isMobile})}
                        onClick={() => {
                            storage.setJSON(
                                "my-list-services", {}
                            )
                        }}
                    >
                        Clear All
                    </Button>
                    {!isMobile && <ShareButton hasTextDescription={true}/>}
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
                {renderTopButtonContainer()}

            </div>
            {renderResults()}
            <ScrollToTop label="To top"/>
            <ToastMessageMyList
                uniqueStorageSubscriptionKey="myListPageUndoKey"
                onClickUndo={undoLastChange}
                isUndo={true}
            />
        </div>
    );
}

export default MyListPage