import React, {useState, ReactNode} from "react";

import ToastMessageComponent from "./ToastMessage";
import useToastMessage from "@/hooks/useToastMessage";
import useMyListToastMessage from "@/hooks/useMyListToastMessage";

export default {
    title: "App Components/ToastMessage",
    component: ToastMessageComponent

};
export const ToastMessage = (): ReactNode => {
    const [index, setIndex] = useState(0);
    const {
        openToastMessage
    } = useToastMessage();
    return (
        <>
            <button
                onClick={() => {
                    setIndex(index + 1), openToastMessage(`message ${index}`);
                }}
            >
                Open toast message
            </button>
            <ToastMessageComponent />
        </>
    )
};
export const ToastMessageWithActionButtonViewMyList = (): ReactNode => {
    const {
        serviceAddedToMyList
    } = useMyListToastMessage();
    return <>
        <button onClick={() => serviceAddedToMyList()}>Open toast message</button>
        <ToastMessageComponent />
    </>;
};
export const ToastMessageWithActionButtonUndoServiceAdded = (): ReactNode => {
    const {
        serviceRemovedFromMyList
    } = useMyListToastMessage();
    return <>
        <button onClick={() => serviceRemovedFromMyList(() => undefined)}>Open toast message</button>
        <ToastMessageComponent />
    </>;
};