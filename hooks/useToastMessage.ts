import type {ReactNode} from "react"

import {useToastMessageContext} from "@/contexts/toast-message-context";


type UseToastMessage = {
    open: boolean,
    setOpen: (arg0: boolean) => void,
    message: string,
    actionDescriptor: ReactNode,
    onActionDescriptorClick: () => void,
    openToastMessage: (
        arg0: string,
        arg1?: ReactNode | null,
        arg2?: (() => void) | null | undefined,
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
        onActionDescriptorClick: (() => void) | null | undefined = () => {},
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

