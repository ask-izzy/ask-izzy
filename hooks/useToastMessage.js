/* @flow */
import type {Node as ReactNode} from "react"

import {useToastMessageContext} from "@/contexts/toast-message-context";


type UseToastMessage = {
    open: boolean,
    setOpen: (boolean) => void,
    message: string,
    actionDescriptor: ReactNode,
    onActionDescriptorClick: () => void,
    openToastMessage: (
        string,
        ?ReactNode | null,
        ?() => void,
    ) => void,
    forceToastMessageUpdateState: boolean,
}

export default (): UseToastMessage => {
    const {
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
    } = useToastMessageContext()

    function openToastMessage(
        message: string = "",
        actionDescriptor: ReactNode | null = null,
        onActionDescriptorClick: ?() => void = () => {},
    ) {
        forceToastMessageUpdate()
        setOpen(true)
        setMessage(message)
        setActionDescriptor(actionDescriptor)
        setOnClick(
            () => () => {
                setOpen(false)
                if (onActionDescriptorClick) {
                    onActionDescriptorClick()
                }
            }
        )
    }

    return {
        open,
        setOpen,
        message,
        actionDescriptor,
        onActionDescriptorClick: onClick,
        openToastMessage,
        forceToastMessageUpdateState,
    }
}

