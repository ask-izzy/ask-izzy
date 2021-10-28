/* @flow */
import React, { useState, useEffect } from "react";
import type {Node as ReactNode} from "react"
import classnames from "classnames";

import Input from "../base/Input";
import FlatButton from "../FlatButton";
import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"
import SearchIcon from "../../icons/Search"

type Props = {
    className?: string,
    initialValue?: string,
    onChange?: (string) => void,
    onSubmit: (string) => void,
    placeholder?: string,
    analyticsEvent?: AnalyticsEvent,
    autocompleteValues?: Array<string>
}

export default function SearchBar({
    className,
    initialValue,
    onChange,
    onSubmit: onSubmitProp,
    placeholder,
    analyticsEvent,
    autocompleteValues,
}: Props): ReactNode {
    function onSubmit(value) {
        gtm.emit({
            event: "Input Submitted - Search",
            eventCat: "Input submitted",
            eventAction: "Text search",
            eventLabel: value,
            sendDirectlyToGA: true,
            ...analyticsEvent,
        });
        onSubmitProp(value)
    }

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
                id="home-page-search"
                type="search"
                onChange={setValue}
                value={value}
                onKeyDown={event => {
                    event.key === "Enter" && onSubmit(value)
                }}
                icon={
                    <SearchIcon className="searchIcon" />
                }
                showClearButton={true}
                placeholder={placeholder}
                autocompleteValues={autocompleteValues}
            />
            <FlatButton
                label="Search"
                className="searchButton"
                onClick={() => onSubmit(value)}
            />
        </div>
    );
}