import React, {useContext, createContext, useState, ReactNode} from "react";
import useForceUpdate from "@/hooks/useForceUpdate";

type Context = {
    open: boolean,
    setOpen: (boolean) => void,
    message: string,
    setMessage: (string) => void,
    actionDescriptor: ReactNode | null,
    setActionDescriptor: (arg0: ReactNode | null) => void,
    onClick: () => void,
    setOnClick: (arg0: () => void) => void,
    forceToastMessageUpdateState: boolean,
    forceToastMessageUpdate: () => void,
}

const ToastMessageContext = createContext<Context>(
    {
        open: false,
        setOpen: () => undefined,
        message: "",
        setMessage: () => undefined,
        actionDescriptor: null,
        setActionDescriptor: () => undefined,
        onClick: () => undefined,
        setOnClick: () => undefined,
        forceToastMessageUpdateState: false,
        forceToastMessageUpdate: () => undefined,
    },
)

type ProviderProps = {
    children: ReactNode,
}

export const ToastMessageProvider = (
    {children}: ProviderProps,
) => {
    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [actionDescriptor, setActionDescriptor] = useState<ReactNode | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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