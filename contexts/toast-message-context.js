/* @flow */
import React, {useContext, createContext, useState, useEffect, useReducer} from "react";
import type {Node as ReactNode} from "react";
import Service from "@/src/iss/Service"
import {getService} from "@/src/iss/load-services"
import storage from "@/src/storage"
import useForceUpdate from "@/hooks/useForceUpdate";

type Context = {
    open: boolean,
    setOpen: (boolean) => void,
    message: string,
    setMessage: (string) => void,
    actionDescriptor: ReactNode | null,
    setActionDescriptor: (ReactNode | null) => void,
    onClick: () => void,
    setOnClick: (() => function) => void,
    forceToastMessageUpdateState: boolean,
    forceToastMessageUpdate: () => void,
}

const ToastMessageContext: React$Context<Context> = createContext<Context>(
    {
        open: false,
        setOpen: () => {},
        message: "",
        setMessage: () => {},
        actionDescriptor: null,
        setActionDescriptor: () => {},
        onClick: () => {},
        setOnClick: () => {},
        forceToastMessageUpdateState: false,
        forceToastMessageUpdate: () => {},
    }
)

type ProviderProps = {
    children: ReactNode,
}

export const ToastMessageProvider = (
    {children}: ProviderProps
): ReactNode => {
    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [actionDescriptor, setActionDescriptor] = useState<ReactNode | null>(null)
    const [onClick, setOnClick] = useState(() => () => {})
    const [forceToastMessageUpdateState, forceToastMessageUpdate] = useForceUpdate()

    const context = {
        open,
        setOpen,
        message,
        setMessage,
        actionDescriptor,
        setActionDescriptor,
        onClick,
        setOnClick,
        forceToastMessageUpdateState,
        forceToastMessageUpdate,
    }
    return (
        <ToastMessageContext.Provider value={context}>
            {children}
        </ToastMessageContext.Provider>
    )
}

export const useToastMessageContext = (): Context => useContext(ToastMessageContext)