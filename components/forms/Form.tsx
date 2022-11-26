import React, {ReactNode} from "react"
import { FormProvider } from "react-hook-form";
import cnx from "classnames"

type Props = {
    children: ReactNode,
    className?: string,
    register?: any,
    unregister?: any,
    formState?: any,
    watch?: any,
    handleSubmit?: any,
    reset?: any,
    resetField?: any,
    setError?: any,
    clearErrors?: any,
    setValue?: any,
    setFocus?: any,
    getValues?: any,
    getFieldState?: any,
    trigger?: any,
    control?: any,
    onSubmit?: any,
    action?: any,
    method?: any,
    schema?: any,
}

export default function Form({
    children,
    className,
    register,
    unregister,
    formState,
    watch,
    handleSubmit,
    reset,
    resetField,
    setError,
    clearErrors,
    setValue,
    setFocus,
    getValues,
    getFieldState,
    trigger,
    control,
    schema,
    ...formProps
}: Props) {
    const formProviderProps = {
        register,
        unregister,
        formState,
        watch,
        handleSubmit,
        reset,
        resetField,
        setError,
        clearErrors,
        setValue,
        setFocus,
        getValues,
        getFieldState,
        trigger,
        control,
        schema,
    }
    return (
        <FormProvider {...formProviderProps}>
            <form
                {...formProps}
                className={cnx("Code", className)}
            >
                {children}
            </form>
        </FormProvider>
    )
}
