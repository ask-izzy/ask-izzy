import React, {useState, useEffect} from "react";
import classnames from "classnames";

import InputWithDropdown from "@/components/general/InputWithDropdown.js";
import FlatButton from "@/src/components/FlatButton.js";
import SearchIcon from "@/src/icons/Search.js"


type Props = {
    className?: string;
    initialValue?: string;
    onChange?: (arg0: React.SyntheticEvent<HTMLInputElement>) => void;
    onSubmit: (arg0: string) => void;
    placeholder?: string;
    iconPosition?: "left" | "right",
    autocompleteValues?: Array<string>;
    inputAriaLabel?: string;
};

function SearchBar({
    className,
    initialValue,
    onChange,
    onSubmit,
    placeholder,
    iconPosition,
    autocompleteValues,
    inputAriaLabel,
}: Props) {
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

export default SearchBar