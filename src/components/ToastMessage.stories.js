/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState} from "react";

import ToastMessageComponent from "./ToastMessage";
import useToastMessage from "@/hooks/useToastMessage";
import useMyListToastMessage from "@/hooks/useMyListToastMessage"


export default {
    title: "App Components/ToastMessage",
    component: ToastMessageComponent,
};


export const ToastMessage = (args: Object): ReactNode => {
    const [index, setIndex] = useState(0)
    const {openToastMessage} = useToastMessage()

    return <>
        <button
            onClick={
                () => {
                    setIndex(index + 1),
                    openToastMessage(`message ${index}`)
                }
            }
        >Open toast message</button>
        <ToastMessageComponent/>
    </>;
}
export const ToastMessageWithActionButtonViewMyList = (args: Object): ReactNode => {
    const {serviceAddedToMyList} = useMyListToastMessage()
    return <>
        <button onClick={() => serviceAddedToMyList()}>Open toast message</button>
        <ToastMessageComponent/>
    </>;
}
export const ToastMessageWithActionButtonUndoServiceAdded = (args: Object): ReactNode => {
    const {serviceRemovedFromMyList} = useMyListToastMessage()
    return <>
        <button onClick={() => serviceRemovedFromMyList(() => {})}>Open toast message</button>
        <ToastMessageComponent/>
    </>;
}