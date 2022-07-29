/* @flow */

import type {Node as ReactNode} from "react"
import React, {useState, useEffect} from "react";
import Button from "./base/Button";
import AddToCompare from "../icons/AddToCompare"
import RemoveFromCompare from "../icons/RemoveFromCompare"
import storage from "../storage";
import classnames from "classnames";

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
    const addToCompareText = "Add to My List"
    const removeFromCompareText = "Remove from My List"
    const textDescription = isRemove ? removeFromCompareText : addToCompareText
    const uniqueStorageSubscriptionKey = "addToCompareButtonKey"

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
        const myList = storage.getJSON("my-list-services")
        if (removeFromStorage) {
            if (myList) {
                delete myList[serviceID]
            }
            storage.setJSON(
                "my-list-services", {...myList}
            )
        } else {
            const newService = {}
            newService[serviceID] = true
            storage.setJSON(
                "my-list-services", {...myList, ...newService}
            )
        }

    }




    return (
        <Button
            className={classnames("AddToCompareButton", className)}
            onClick={onClick}
            aria-label={isRemove ? "Remove from my list" : "Add to my list"}
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