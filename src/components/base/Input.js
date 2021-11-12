/* @flow */
import React, {useRef} from "react"
import type {
    Node as ReactNode,
    AbstractComponent as ReactAbstractComponent,
} from "react"
import cnx from "classnames"
import { useCombobox } from "downshift"

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
    autocompleteValues,
    ...otherProps
}: Props, ref: ?refType): ReactNode {
    // Flow.js doesn't look like it has a way to type React.forwardRef() so that
    // it only accepts new style refs. So typechecking won't fail if a old style
    // ref is passed in but we can't use old style refs in this function so
    // we'll silently ignore the passed in ref if it's an old style ref.
    const inputRef = (ref && typeof ref !== "function") ? ref : useRef()

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

    if (autocompleteValues) {
        autocompleteObjValues = autocompleteValues.map(
            value => typeof value === "string" ? {value, label: value} : value
        )

        downshiftCombobox = useCombobox({
            items: autocompleteObjValues,
            inputValue: value,
            itemToString: item => item.value,
            onInputValueChange: ({inputValue}) => {
                otherProps.onChange(inputValue)
            },
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
                downshiftInputProps.onKeyDown(event)
                const suggestionSelected =
                    downshiftCombobox?.highlightedIndex > -1
                if (
                    event.key !== "ArrowUp" &&
                    event.key !== "ArrowDown" &&
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
    }

    const isAutocompleteSuggestions = downshiftCombobox?.isOpen &&
        autocompleteValues?.length

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
                    className="autocompleteList"
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
                    autocompleteObjValues?.map((item, index) => (
                        <li
                            key={item.value}
                            {...downshiftCombobox?.getItemProps(
                                { item, index }
                            )}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <div
            className={cnx(
                "Input",
                className,
                {isAutocompleteSuggestions},
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
