import React, {useRef} from "react"
import type {
    ReactNode,
    ReactElement,
} from "react"
import cnx from "classnames"

import Button from "./Button"

type autocompleteObjValue = {
    value: string,
    label: ReactNode
}

type Props = {
    className?: string,
    value?: string,
    icon?: ReactNode,
    iconPosition?: "left" | "right",
    showClearButton?: boolean,
    initialSuggestions?: Array<autocompleteObjValue>,
    onInitialSuggestionsSelected?: () => void,
    initialSuggestionsA11yStatusMessage?: string,
    autocompleteValues?: Array<autocompleteObjValue> | Array<string>,
    onKeyDown?: (arg0: React.KeyboardEvent<HTMLInputElement>) => void,
    onBlur?: (arg0: React.FocusEvent<HTMLInputElement>) => void,
    onFocus?: (arg0: React.FocusEvent<HTMLInputElement>) => void,
    containerProps?: {[key: string]: any},
    extraContainerChildren?: ReactNode,
    // Either onChange or customInputElement should be given
    onChange?: (arg0: React.ChangeEvent<HTMLInputElement>) => void,
    customInputElement?: (props: CustomInputElementProps) => ReactElement<"input">,
} & Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "onChange" | "onKeyDown" | "onBlur" | "onFocus"
>

export type CustomInputElementProps = {
    className: string,
    onChange?: (arg0: React.ChangeEvent<HTMLInputElement>) => void,
    value?: string,
}

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
    customInputElement,
    containerProps,
    extraContainerChildren,
    ...otherProps
}: Props, refProp: React.ForwardedRef<HTMLInputElement>): ReactNode {

    if (customInputElement && !refProp) {
        throw Error("If the customInputElement prop is used a ref should also be given.")
    }

    const inputRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
        (refProp && typeof refProp !== "function") ? refProp : useRef<HTMLInputElement>()

    function setRef(elm: HTMLInputElement | null) {
        inputRef.current = elm
        if (typeof refProp === "function") {
            refProp(elm)
        } else if (refProp) {
            refProp.current = elm
        }
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
                        console.log("inputRef.current", inputRef.current)
                        if (inputRef.current) {
                            inputRef.current.focus()
                            // Due to the way React works we can't modify the the value of the input
                            // field directly so we've got to generate a native input event.
                            // Based off https://stackoverflow.com/a/61110332/847536
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype,
                                "value"
                            )?.set;
                            nativeInputValueSetter?.call(inputRef.current, "");

                            const inputEvent = new Event("input", { bubbles: true});
                            inputRef.current?.dispatchEvent(inputEvent);
                        }
                    }}
                >
                    <span className="text">Clear </span>&times;
                </Button>
            )
        }
    }

    const inputClassName = cnx({
        "includes-icon": icon,
        "includes-clear": showClearButton,
        "iconLeft": (iconPosition === "left" && icon),
        "iconRight": (iconPosition === "right" && icon),
    })

    const customInputElementProps: CustomInputElementProps = {
        className: inputClassName,
        onChange: otherProps.onChange,
        value,
    }

    return (
        <div
            className={cnx(
                "Input",
                className,
            )}
            {...containerProps}
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
            {customInputElement ?
                customInputElement(customInputElementProps)
                : (
                    <input
                        {...otherProps}
                        ref={setRef}
                        className={inputClassName}
                    />
                )
            }
            {extraContainerChildren ?? null}
            {renderClearBtn()}
        </div>
    )
}

export default React.forwardRef<HTMLInputElement, Props>(Input)
