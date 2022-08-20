/* @flow */

import type {Node as ReactNode} from "react"
import React, {useState, useEffect} from "react";
import Button from "./base/Button";
import AddToCompare from "../icons/AddToCompare"
import RemoveFromCompare from "../icons/RemoveFromCompare"
import storage from "../storage";
import classnames from "classnames";
import * as gtm from "@/src/google-tag-manager";
import useNextServiceId from "@/hooks/useNextServiceId"

type Props = {
    hasTextDescription?: boolean,
    serviceID: number,
    className?: string,
}

function AddToCompareButton({
    hasTextDescription = false,
    serviceID,
    className,
}: Props): ReactNode {
    const [isRemove, setIsRemove] = useState<boolean>(getInitialState())
    const getNextIdx = useNextServiceId()
    const addToCompareText = "Add to My List"
    const removeFromCompareText = "Remove from My List"
    const textDescription = isRemove ? removeFromCompareText : addToCompareText
    const uniqueStorageSubscriptionKey = "addToCompareButtonKey" + serviceID.toString()

    useEffect(() => {
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, [])

    const jsonStorageObj = "my-list-services"

    function subscribeToJsonChange() {
        storage.subscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey, updateButton)
        return function cleanup() {
            storage.unsubscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey)
        };
    }

    const updateButton = () => {
        const myList = storage.getJSON(jsonStorageObj)
        if (Object.keys(myList).includes(serviceID.toString())) {
            setIsRemove(true)
        } else {
            setIsRemove(false)
        }
    }

    function getInitialState() {
        const myList = storage.getJSON("my-list-services")
        if (myList) {
            return serviceID in myList
        }
        return false
    }

    function onClick() {
        changeServiceStorage(isRemove)
        setIsRemove(!isRemove)
    }

    function changeServiceStorage(removeFromStorage) {
        const myList = storage.getJSON("my-list-services") || {}
        const oldMyListLength = Object.keys(myList).length

        if (removeFromStorage) {
            delete myList[serviceID]
        } else {
            myList[serviceID] = getNextIdx()
        }

        storage.setJSON("my-list-services", myList)

        const myListLength = Object.keys(myList).length

        if (oldMyListLength === 0) {
            gtm.emit({
                event: "Action Triggered - New List",
                eventCat: "Action triggered",
                eventAction: "New list",
                eventLabel: null,
                eventValue: myListLength,
                sendDirectlyToGA: true,
            });
        }
        gtm.emit({
            event: "Action Triggered - List Size Changed",
            eventCat: "Action triggered",
            eventAction: "List size changed",
            eventLabel: null,
            eventValue: myListLength,
            sendDirectlyToGA: true,
        });
    }

    return (
        <Button
            className={
                classnames(
                    "AddToCompareButton",
                    className,
                    {"AddToCompare": !isRemove, "RemoveFromCompare": isRemove}
                )
            }
            onClick={onClick}
            aria-label={isRemove ? "Remove from my list" : "Add to my list"}
            analyticsEvent={{
                event: `Action Triggered - Service ${isRemove ? "Removed From" : "Added To"} List`,
                eventAction: `Service ${isRemove ? "removed from" : "added to"} list`,
                eventLabel: String(serviceID),
            }}
        >
            <div className="main-container">
                {
                    isRemove ? <RemoveFromCompare className={classnames({"has-no-text": !hasTextDescription})}/>
                        : <AddToCompare className={classnames({"has-no-text": !hasTextDescription})}/>
                }
                {
                    hasTextDescription ?
                        <span className="text-description">{textDescription}</span>
                        : null
                }
            </div>
        </Button>
    )
}

export default AddToCompareButton
