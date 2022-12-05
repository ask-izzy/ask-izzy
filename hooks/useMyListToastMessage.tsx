import React from "react";
import { useRouter } from "next/router"

import useToastMessage from "@/hooks/useToastMessage";
import MyListIcon from "@/src/icons/MyList"
import UndoIcon from "@/src/icons/Undo"

type UseMyListToastMessage = {
    serviceAddedToMyList: () => void,
    serviceRemovedFromMyList: (arg0: () => void) => void,
    clearedAllServicesFromMyList: (arg0: () => void) => void,
}

export default (): UseMyListToastMessage => {
    const router = useRouter()
    const {openToastMessage} = useToastMessage()

    const actionDescriptorUndo = (
        <div className="action-descriptor"
            aria-label="Press enter to undo"
        >
            <UndoIcon aria-label=""/>
            <span>Undo</span>
        </div>
    )

    const actionDescriptorAdd = (
        <div className="action-descriptor"
            aria-label="Press enter to access My List"
        >
            <MyListIcon />
            <span>View My List</span>
        </div>
    )


    function serviceAddedToMyList(): void {
        openToastMessage(
            "Service added to your list",
            actionDescriptorAdd,
            () => {
                router.push("/my-list")
            },
        )
    }

    function serviceRemovedFromMyList(undoLastChangeCallback: () => void): void {
        openToastMessage(
            "Service removed",
            actionDescriptorUndo,
            undoLastChangeCallback,
        )
    }

    function clearedAllServicesFromMyList(undoLastChangeCallback: () => void): void {
        openToastMessage(
            "Services removed",
            actionDescriptorUndo,
            undoLastChangeCallback,
        )
    }

    return {
        serviceAddedToMyList,
        serviceRemovedFromMyList,
        clearedAllServicesFromMyList,
    }
}
