/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import { useFormContext } from "react-hook-form";

import Input from "@/src/components/base/Input"

type Props = {|
    label: string,
    id: string,
    description?: string,
|}

export default function FormTextInput({
    label,
    id,
    description = null,
    ...otherProps
}: Props): ReactNode {
    const { register, formState, schema } = useFormContext();
    const { errors } = formState

    const required = schema?.describe().fields[id].tests
        .some(({ name }) => name === "required")

    let errorMessage
    if (errors && errors[id]?.type === "required") {
        errorMessage = "This field is required"
    } else if (errors && errors[id]) {
        errorMessage = errors[id]?.message
    }

    const inputProps = {...register(id, { required })}

    return <div className="FormTextInput">
        <label htmlFor={id}>
            <div className="title">
                {label}{!required && " (optional)"}
            </div>
            {errorMessage && <span className="errorMessage">{errorMessage}</span>}
            {description && <div className="description">{description}</div>}
        </label>
        <Input
            id={id}
            {...inputProps}
            {...otherProps}
        />
    </div>
}
