/* @flow */
import React, {useRef, useState} from "react"
import type {
    Node as ReactNode,
    AbstractComponent as ReactAbstractComponent,
} from "react"
import cnx from "classnames"
import { useCombobox, resetIdCounter } from "downshift"

import Button from "./Button"

type autocompleteObjValue = {
    value: string,
    label: ReactNode
}

type Props = {
    className?: string,
    value: string,
    onChange: (string) => void,
    icon?: ReactNode,
    iconPosition?: "left" | "right",
    showClearButton?: boolean,
    initialSuggestions?: Array<autocompleteObjValue>,
    onInitialSuggestionsSelected?: () => void,
    initialSuggestionsA11yStatusMessage?: string,
    autocompleteValues?: Array<autocompleteObjValue> | Array<string>,
    onKeyDown?: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
    onBlur?: (SyntheticFocusEvent<HTMLInputElement>) => void,
    onFocus?: (SyntheticFocusEvent<HTMLInputElement>) => void,
}

type refType = { current: null | HTMLInputElement } |
    ((null | HTMLInputElement) => mixed)

function Input({
    className,
    value,
    icon,
    iconPosition = "left",
    showClearButton = false,
    initialSuggestions = [],
    onInitialSuggestionsSelected = () => {},
    initialSuggestionsA11yStatusMessage,
    autocompleteValues = [],
    ...otherProps
}: Props, ref: ?refType): ReactNode {
    //previousAutocompleteLength is used to solve regression AI-41 caused by
    //not proper reloading of the input component. Overriding the function
    //getA11yStatusMessage to use previousAutocompleteLength was necessary.
    //previousAutocompleteLength is a list with the last two historical
    //length values of autocompleteValues.
    const
        [
            previousAutocompleteLength,
            setPreviousAutocompleteLength,
        ] = useState([0, 0])
    // Flow.js doesn't look like it has a way to type React.forwardRef() so that
    // it only accepts new style refs. So typechecking won't fail if a old style
    // ref is passed in but we can't use old style refs in this function so
    // we'll silently ignore the passed in ref if it's an old style ref.
    const inputRef = (ref && typeof ref !== "function") ? ref : useRef()

    const showInitialSuggestions = autocompleteValues.length == 0 &&
        initialSuggestions.length > 0

    // Make sure the id is deterministic over multiple renders so as not to
    // break hydration.
    resetIdCounter()

    let otherInputProps = {
        ...otherProps,
        onChange(event: SyntheticInputEvent<HTMLInputElement>) {
            otherProps.onChange(event.target.value)
        },
        ref: inputRef,
        value,
    }
    let downshiftCombobox,
        autocompleteObjValues: Array<autocompleteObjValue>

    if (autocompleteValues.length !== previousAutocompleteLength[1]) {
        setPreviousAutocompleteLength(
            [previousAutocompleteLength[1], autocompleteValues.length]
        )
    }

    autocompleteObjValues =
        (autocompleteValues.length > 0) ?
            autocompleteValues.map(
                value => typeof value === "string" ?
                    {value, label: value} : value
            )
            : initialSuggestions
    downshiftCombobox = useCombobox({
        items: autocompleteObjValues,
        inputValue: value,
        itemToString: item => item.value,
        onInputValueChange: ({inputValue}) => {
            otherProps.onChange(inputValue)
        },
        getA11yStatusMessage: getA11yStatusMessage,
    })
    const downshiftInputProps = downshiftCombobox.getInputProps({
        ref: inputRef,
    })
    // Mix in downshift props with the list of props destined for <input />
    otherInputProps = {
        ...otherProps,
        ...downshiftInputProps,
        // Since downshift uses onKeyDown we need to create a wrapper so
        // that both downshift's onKeyDown function and our own one (if
        // provided via a prop) are both called.
        onKeyDown(event) {
            const suggestionSelected =
                    downshiftCombobox?.highlightedIndex > -1
            const ArrowKeys = ["ArrowUp", "ArrowDown"]
            if (downshiftCombobox.isOpen && showInitialSuggestions) {
                if (event.key === "Enter") {
                    onInitialSuggestionsSelected()
                    inputRef.current?.focus()
                    return false
                }
                // Disables ability to select option  when initial
                // suggestion is displayed. This is required due to
                // a bug takes the focus away from the input bar if
                // an item is selected and instead of normal
                // behavior a custom function is called.

                if (ArrowKeys.includes(event.key)) {
                    return false
                }
            }

            downshiftInputProps.onKeyDown(event)

            if (
                !(ArrowKeys.includes(event.key)) &&
                (event.key !== "Enter" || !suggestionSelected) &&
                (event.key !== "Escape" || !suggestionSelected)
            ) {
                    otherProps.onKeyDown?.(event)
            }
        },
        // Same situation for onBlur
        onBlur(event) {
            downshiftInputProps.onBlur(event)
                otherProps.onBlur?.(event)
        },
        // Show autocomplete suggestions when focusing on input
        onFocus(event) {
            if (!downshiftCombobox.isOpen) {
                downshiftCombobox.openMenu(event)
            }
                otherProps.onFocus?.(event)
        },
    }

    function getIsAutocompleteSuggestions() {
        return downshiftCombobox?.isOpen &&
        (autocompleteValues?.length || initialSuggestions)
    }

    function getA11yStatusMessage({isOpen, resultCount, previousResultCount}) {
        if (!isOpen) {
            return ""
        }

        if (initialSuggestionsA11yStatusMessage && showInitialSuggestions) {
            return initialSuggestionsA11yStatusMessage
        }


        if (!resultCount && resultCount !== previousAutocompleteLength[0]) {
            return "No results are available."
        }

        if (resultCount !== previousAutocompleteLength[0]) {
            setPreviousAutocompleteLength(
                [previousAutocompleteLength[1], autocompleteValues.length]
            )
            return `${resultCount} result${
                resultCount === 1 ? " is" : "s are"
            } available, use up and down arrow
            keys to navigate. Press Enter key to select.`
        }
        return ""
    }

    function renderClearBtn() {
        if (showClearButton && value) {
            return (
                <Button
                    className={cnx(
                        "clear-text",
                        {
                            "iconLeft": (iconPosition === "left" && icon),
                            "iconRight": (iconPosition === "right" && icon),
                        }
                    )}
                    aria-label="Clear entered search text"
                    onClick={() => {
                        otherProps.onChange("")
                        inputRef.current?.focus()
                    }}
                >
                    <span className="text">Clear </span>&times;
                </Button>
            )
        }
    }

    function renderAutoCompleteList() {
        if (downshiftCombobox) {
            return (
                <ul
                    {...downshiftCombobox?.getMenuProps()}
                    className={cnx("autocompleteList", {
                        "initialSuggestions": showInitialSuggestions,
                    })}
                    // By default once the list grows long enough that this
                    // element becomes scrollable it also becomes tabbable.
                    // Unfortunately this is unhelpful since tabbing to it
                    // will remove focus from the input bar and thus close the
                    // list and focus will be lost. We don't really want it
                    // to be accessible via tabbing anyway since you can't tab
                    // to individual options (autocomplete widgets generally use
                    // arrow keys to navigate between options not the tab key).
                    tabIndex="-1"
                >
                    {downshiftCombobox.isOpen &&
                    autocompleteObjValues?.map((item, index) => {
                        return (
                            <li
                                key={item.value}
                                {...downshiftCombobox?.getItemProps(
                                    { item, index }
                                )}
                                onMouseDown={event => {
                                    if (showInitialSuggestions) {
                                        event.preventDownshiftDefault = true
                                    }
                                }}

                            >
                                {item.label}
                            </li>
                        )
                    })}
                </ul>
            )
        }
    }

    return (
        <div
            className={cnx(
                "Input",
                className,
                {isAutocompleteSuggestions: getIsAutocompleteSuggestions()},
            )}
            {...downshiftCombobox?.getComboboxProps()}
        >
            {icon &&
                <div className={cnx(
                    "icon",
                    {
                        "iconLeft": (iconPosition === "left"),
                        "iconRight": (iconPosition === "right"),
                    }
                )}
                >
                    {icon}
                </div>
            }
            <input
                {...otherInputProps}
                className={cnx({
                    "includes-icon": icon,
                    "includes-clear": showClearButton,
                    "iconLeft": (iconPosition === "left" && icon),
                    "iconRight": (iconPosition === "right" && icon),
                })}
            />
            {renderAutoCompleteList()}
            {renderClearBtn()}
        </div>
    )
}

export default (
    React.forwardRef<Props, HTMLInputElement>(Input):
        ReactAbstractComponent<Props, HTMLInputElement>
)
