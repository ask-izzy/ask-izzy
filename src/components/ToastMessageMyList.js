/* @flow */

import React, {useEffect, useState} from "react";
import type {Node as ReactNode} from "react"
import { useRouter } from "next/router"


import useTrackDifference from "../../hooks/useTrackDifference"
import ToastMessage from "../components/ToastMessage"
import MyList from "../icons/MyList"
import Undo from "../icons/Undo"
import storage from "../storage"
import {MobileDetect} from "../effects/MobileDetect";


type Props = {
    uniqueStorageSubscriptionKey: string,
    isUndo?: boolean,
    isAdd?: boolean,
}

export default function ToastMessageMyList({
    uniqueStorageSubscriptionKey,
    isUndo = false,
    isAdd = false,
}: Props): ReactNode {
    const router = useRouter()
    const [message, setMessage] = useState<string>("")
    const [typeOfMessage, setTypeOfMessage] = useState<string>("")
    const [actionDescriptor, setActionDescriptor] = useState<ReactNode>(<></>)
    const [servicesChangedSignal, setServicesChangedSignal] = useState<boolean>(false)
    const [
        updateServices,
        findRemovedServices,
        currentServicesLengthDifference,
    ] = useTrackDifference()

    useEffect(() => {
        updateToastMessage(true)
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, [])

    useEffect(() => {
        if (servicesChangedSignal) {
            setServicesChangedSignal(false)
        }
    }, [servicesChangedSignal])

    const jsonStorageObj = "my-list-services"
    const isMobile = MobileDetect(500)

    const actionDescriptorUndo = (
        <div className="action-descriptor"
            aria-label="Press enter to undo"
        >
            <Undo aria-label=""/>
            <span>UNDO</span>
        </div>
    )

    const actionDescriptorAdd = (
        <div className="action-descriptor"
            aria-label="Press enter to access My List"
        >
            {!isMobile && <MyList />}
            <span>VIEW MY LIST</span>
        </div>
    )

    const updateToastMessage = (initial: boolean) => {
        const myList = storage.getJSON(jsonStorageObj)
        updateServices(myList)
        const difference = currentServicesLengthDifference()
        const serviceAdded = difference > 0
        const serviceRemoved = difference < 0
        if (!initial && myList) {
            if (isAdd && serviceAdded) {
                setServicesChangedSignal(true)
                setMessage("Service added to your list")
                setActionDescriptor(actionDescriptorAdd)
                setTypeOfMessage("add")

            } else if (isUndo && serviceRemoved) {
                setServicesChangedSignal(true)
                const oneServiceRemoved = difference == -1
                const undoMessage = oneServiceRemoved ?
                    "Service removed"
                    : "Services removed"

                setMessage(undoMessage)
                setActionDescriptor(actionDescriptorUndo)
                setTypeOfMessage("undo")
            }
        }
    }

    const undoLastChange = () => {
        const myList = storage.getJSON(jsonStorageObj)
        // add all missing services
        const removedServices = findRemovedServices()
        if (myList) {
            removedServices.forEach(
                (item) => {
                    myList[item[0].toString()] = item[1]
                }
            )

            storage.setJSON(
                "my-list-services", myList
            )
        }

    }

    const viewMyList = () => {
        router.push("/my-list")
    }

    function subscribeToJsonChange() {
        storage.subscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey, updateToastMessage)
        return function cleanup() {
            storage.unsubscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey)
        };
    }

    return (
        <div className="ToastMessageMyList">
            <ToastMessage
                open={servicesChangedSignal}
                onClick={() => {
                    if (typeOfMessage === "add") {
                        viewMyList()
                    }
                    if (typeOfMessage === "undo") {
                        undoLastChange()
                    }
                }}
                message={message}
                hasActionButton={true}
                actionDescriptor={actionDescriptor}
            />
        </div>
    );
}
