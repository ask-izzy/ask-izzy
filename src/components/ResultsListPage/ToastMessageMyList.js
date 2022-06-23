/* @flow */

import React, {useEffect, useState, useRef} from "react";
import type {Node as ReactNode} from "react"
import ToastMessage from "../../components/ResultsListPage/ToastMessage"
import MyList from "../../icons/MyList"
import Undo from "../../icons/Undo"
import storage from "../../storage"


type Props = {
    uniqueStorageSubscriptionKey: string,
    onClickAdd?: function,
    onClickUndo?: function,
    isUndo?: boolean,
    isAdd?: boolean,
}
type myListObjType = {string: Object}

export default function ToastMessageMyList({
    uniqueStorageSubscriptionKey,
    onClickAdd = () => {},
    onClickUndo = () => {},
    isUndo = false,
    isAdd = false,
}: Props): ReactNode {
    const [message, setMessage] = useState<string>("")
    const [typeOfFunction, setTypeOfFunction] = useState<string>("")
    const [actionDescriptor, setActionDescriptor] = useState<ReactNode>(<></>)
    const [addedServiceSignal, setAddedServiceSignal] = useState<boolean>(false)
    const [myListCache, setMyListCache] = useState<myListObjType>({})
    // ref is to fix the stale closure issue
    // caused by updateServices callback
    // fix requires using a ref and a useState hook
    // https://stackoverflow.com/questions/
    // 62806541/how-to-solve-the-react-hook-closure-issue
    const myListCacheRef = useRef()

    useEffect(() => {
        updateToastMessage(true)
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, [])

    useEffect(() => {
        myListCacheRef.current = myListCache
    }, [myListCache])

    useEffect(() => {
        if (addedServiceSignal) {
            setAddedServiceSignal(false)
        }
    }, [addedServiceSignal])

    const jsonStorageObj = "my-list-services"

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
            <MyList />
            <span>View My List</span>
        </div>
    )

    const updateToastMessage = (initial: boolean) => {
        const myList = storage.getJSON(jsonStorageObj)
        if (!initial && myList) {
            const cacheLength = myListCacheRef.current ?
                Object.keys(myListCacheRef.current).length
                : 0
            const storageLength = Object.keys(myList).length
            if (isAdd && storageLength > cacheLength) {
                // service was added to my list
                setAddedServiceSignal(true)
                setMessage("Service added to your list")
                setActionDescriptor(actionDescriptorAdd)
                setTypeOfFunction("add")
            } else if (isUndo && storageLength < cacheLength) {
                // service was removed from my list
                setAddedServiceSignal(true)
                const curMessage = cacheLength - storageLength > 1 ?
                    "Services removed"
                    : "Service removed"
                setMessage(curMessage)
                setActionDescriptor(actionDescriptorUndo)
                setTypeOfFunction("undo")
            }
        }
        setMyListCache(myList)
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
                open={addedServiceSignal}
                onClick={() => {
                    if (typeOfFunction === "add") {
                        onClickAdd()
                    }
                    if (typeOfFunction === "undo") {
                        onClickUndo()
                    }
                }}
                message={message}
                hasActionButton={true}
                actionDescriptor={actionDescriptor}
            />
        </div>
    );
}
