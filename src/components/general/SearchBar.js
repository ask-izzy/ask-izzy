/* @flow */
import React, { useState, useEffect } from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react"
import classnames from "classnames";

import Input from "../base/Input";
import FlatButton from "../FlatButton";
import SearchIcon from "../../icons/Search"

type Props = {
    className?: string,
    initialValue?: string,
    onChange?: (string) => void,
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
    const [value, setValueDirect] = useState<string>(initialValue || "")
    function setValue(newValue) {
        setValueDirect(newValue)
        onChange?.(newValue)
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
            <Input
                type="search"
                onChange={setValue}
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
