/* @flow */
import React, { useState, useEffect } from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react"
import classnames from "classnames";

import InputWithDropdown from "@/components/general/InputWithDropdown";
import Input from "@/src/components/base/Input";
import FlatButton from "../FlatButton";
import SearchIcon from "../../icons/Search"

type Props = {
    className?: string,
    initialValue?: string,
    onChange?: (SyntheticInputEvent<HTMLInputElement>) => void,
    onSubmit: (string) => void,
    placeholder?: string,
    iconPosition?: $PropertyType<
        ReactElementConfig<typeof Input>,
        'iconPosition'
    >,
    autocompleteValues?: Array<string>,
    inputAriaLabel?: string
}

export default function SearchBar({
    className,
    initialValue,
    onChange,
    onSubmit,
    placeholder,
    iconPosition,
    autocompleteValues,
    inputAriaLabel,
}: Props): ReactNode {
    const [value, setValue] = useState<string>(initialValue || "")
    function handleOnChange(event) {
        setValue(event.target.value)
        onChange?.(event)
    }
    useEffect(() => {
        initialValue && setValue(initialValue)
    }, [initialValue])


    return (
        <div
            className={classnames(
                "SearchBar",
                className,
            )}
        >
            <InputWithDropdown
                type="search"
                onChange={handleOnChange}
                value={value}
                onKeyDown={event => {
                    event.key === "Enter" && value && onSubmit(value)
                }}
                icon={
                    <SearchIcon className="searchIcon" />
                }
                iconPosition={iconPosition}
                showClearButton={true}
                placeholder={placeholder}
                autocompleteValues={autocompleteValues}
                {...(inputAriaLabel ? {"aria-label": inputAriaLabel} : {})}
            />
            <FlatButton
                label="Search"
                className="searchButton"
                onClick={() => value && onSubmit(value)}
            />
        </div>
    );
}
