/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState, useEffect} from "react";

import ToastMessageComponent from "./ToastMessage";

export default {
    title: "App Components/ToastMessage",
    component: ToastMessageComponent,
};


export const ToastMessage = (args: Object): ReactNode => {
    const [servicesChangedSignal, setServicesChangedSignal] = useState(true)
    useEffect(() => {
        if (servicesChangedSignal) {
            setServicesChangedSignal(false)
        }
    }, [servicesChangedSignal])

    return <>
        <button onClick={() => setServicesChangedSignal(true)}>Open dialog</button>
        <ToastMessageComponent
            open={servicesChangedSignal}
            hasActionButton ={false}
            message="This is a test toast message"
        />
    </>;
}
export const ToastMessageWithActionButton = (args: Object): ReactNode => {
    const [servicesChangedSignal, setServicesChangedSignal] = useState(true)
    useEffect(() => {
        if (servicesChangedSignal) {
            setServicesChangedSignal(false)
        }
    }, [servicesChangedSignal])

    return <>
        <button onClick={() => setServicesChangedSignal(true)}>Open dialog</button>
        <ToastMessageComponent
            open={servicesChangedSignal}
            message="This is a test toast message"
            hasActionButton={true}
            actionDescriptor={
                <span>Action Button</span>
            }
        />
    </>;
}