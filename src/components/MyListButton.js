/* @flow */

import type {Element as ReactElement} from "react"
import React, {useState, useEffect} from "react";
import Link from "./base/Link";
import MyList from "../icons/MyList"
import storage from "../storage";

type Props = {
    hasTextDescription?: boolean,
}

function MyListButton({
    hasTextDescription = false,
}: Props): ReactElement<typeof Link> {
    const [serviceCount, setServiceCount] = useState<number>(0)
    const jsonStorageObj = "my-list-services"
    const uniqueStorageSubscriptionKey = "myListCountHeaderKey"

    useEffect(() => {
        updateServiceCount()
        const cleanup = subscribeToJsonChange()
        return cleanup
    }, []);

    function subscribeToJsonChange() {
        storage.subscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey, updateServiceCount)
        return function cleanup() {
            storage.unsubscribeToJsonChange(jsonStorageObj, uniqueStorageSubscriptionKey)
        };
    }

    function updateServiceCount() {
        const myListObjects = storage.getJSON(jsonStorageObj)
        if (myListObjects) {
            setServiceCount(Object.keys(myListObjects)?.length)
        }

    }

    return (
        <Link className="MyListButton"
            to="/my-list"
            aria-label={`MyList, ${serviceCount} items saved`}
        >
            <div className="list-button">
                <MyList />
            </div>
            <span className="title">My List</span>
            <div className="my-list-count">
                {serviceCount < 100 ? serviceCount : "99+"}
            </div>
        </Link>
    )
}

export default MyListButton
