import React, {useRef, useState, ReactNode, ForwardedRef} from "react"
import cnx from "classnames"
import { useCombobox, resetIdCounter } from "downshift"

import Input from "@/src/components/base/Input"

type autocompleteObjValue = {
    value: string,
    label: ReactNode
}

type Props = {
    className?: string
    value: string
    onChange: (event: Event) => any
    icon?: ReactNode
    showClearButton?: boolean
    initialSuggestions?: Array<autocompleteObjValue>
    onInitialSuggestionsSelected?: () => void
    initialSuggestionsA11yStatusMessage?: string
    autocompleteValues?: Array<autocompleteObjValue> | Array<string>
    onKeyDown?: (arg0: React.KeyboardEvent<HTMLInputElement>) => void
    onBlur?: (arg0: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (arg0: React.FocusEvent<HTMLInputElement>) => void
    loadingResults?: boolean
} & Parameters<typeof Input>[0]

function InputWithDropdown({
    className,
    value,
    icon,
    iconPosition = "left",
    showClearButton = false,
    initialSuggestions = [],
    onInitialSuggestionsSelected = () => undefined,
    initialSuggestionsA11yStatusMessage = "",
    autocompleteValues = [],
    loadingResults = false,
    ...otherProps
}: Props, ref: ForwardedRef<HTMLInputElement>) {
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

    const inputRef = (ref && typeof ref !== "function") ? ref : useRef(null)

    const showInitialSuggestions = autocompleteValues.length == 0 &&
        initialSuggestions.length > 0

    // Make sure the id is deterministic over multiple renders so as not to
    // break hydration.
    resetIdCounter()

    let otherInputProps = {
        ...otherProps,
        ref: inputRef,
        value,
    }

    if (autocompleteValues.length !== previousAutocompleteLength[1]) {
        setPreviousAutocompleteLength(
            [previousAutocompleteLength[1], autocompleteValues.length],
        )
    }

    const autocompleteObjValues: Array<autocompleteObjValue> =
        (autocompleteValues.length > 0) ?
            autocompleteValues.map(
                value => typeof value === "string" ?
                    {value, label: value} : value,
            )
            : initialSuggestions
    const downshiftCombobox = useCombobox({
        items: autocompleteObjValues,
        inputValue: value,
        itemToString: item => item ? item.value : "",
        onInputValueChange: ({inputValue, selectedItem}) => {
            // Dropshift.js doesn't emit an onChange event when input is
            // entered via selecting from the dropdown. In order to make
            // this component behehave like a standard input element we
            // need to construct our own change event and emit that our
            // selves in these circumstances.
            if (selectedItem && selectedItem.value === inputValue) {
                // Based off https://stackoverflow.com/a/61110332/847536
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value",
                )?.set;
                nativeInputValueSetter?.call(inputRef.current, "");

                const inputEvent = new Event("change", { bubbles: true});

                if (inputRef.current) {
                    // We need to set the value of the input element so that the event emitted
                    // for onChange will give the correct value. I.e. event.target.value will be
                    // equal to the.
                    inputRef.current.value = inputValue
                    // In order that our inputEvent has the target value set correctly we have to
                    // dispatch it to initialise (we can't just set it manually and then call the
                    // onChange callback prop with it). However since we have already updated the
                    // input element to contain the correct value react or dropdown.js seem to
                    // intercept the emitted event and stop it reaching the onChange event we
                    // attached in the jsx. So in order to make sure the onChange callback prop is
                    // actually called we need to attach a new event listener and use that to capture
                    // the emitted event and then call onChange with it.
                    inputRef.current.addEventListener(
                        "change",
                        otherProps.onChange,
                        {once: true},
                    )
                    inputRef.current?.dispatchEvent(inputEvent)
                }
            }
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
        onChange(event) {
            otherProps.onChange(event)
            downshiftInputProps.onChange(event)
        },
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
                downshiftCombobox.openMenu()
            }
            otherProps.onFocus?.(event)
        },
    }

    function getIsAutocompleteSuggestions() {
        return downshiftCombobox?.isOpen &&
        (autocompleteValues?.length || initialSuggestions?.length)
    }

    function getA11yStatusMessage({isOpen, resultCount}) {
        if (!isOpen) {
            return ""
        }

        if (showInitialSuggestions) {
            return initialSuggestionsA11yStatusMessage
        }

        if (resultCount === previousAutocompleteLength[0] || loadingResults) {
            return ""
        }

        if (resultCount == 0 && autocompleteValues.length === 0) {
            return "No results are available."
        }

        if (resultCount != 0 && autocompleteValues.length !== 0) {
            setPreviousAutocompleteLength(
                [previousAutocompleteLength[1], autocompleteValues.length],
            )
            return `${resultCount} result${
                resultCount === 1 ? " is" : "s are"
            } available, use up and down arrow
            keys to navigate. Press Enter key to select.`
        }
        return ""
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
                                    {item, index},
                                )}
                                onMouseDown={event => {
                                    if (showInitialSuggestions) {
                                        // as any required due to limited
                                        // downshift support for typescript
                                        (event as any).preventDownshiftEvent = true
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
        <Input
            icon={icon}
            iconPosition={iconPosition}
            showClearButton={showClearButton}
            className={cnx(
                "InputWithDropdown",
                className,
                {isAutocompleteSuggestions: getIsAutocompleteSuggestions()},
            )}
            value={value}
            containerProps={downshiftCombobox?.getComboboxProps()}
            customInputElement={(inputProps) =>
                <input
                    {...inputProps}
                    {...otherInputProps}
                />
            }
            ref={inputRef}
            extraContainerChildren={renderAutoCompleteList()}
        />
    )
}

export default (
    React.forwardRef<HTMLInputElement, Props>(InputWithDropdown)
)
