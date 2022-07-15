/* @flow */
import React, {useRef} from "react"
import type {
    Node as ReactNode,
    Element as ReactElement,
    AbstractComponent as ReactAbstractComponent,
} from "react"
import cnx from "classnames"

import Button from "./Button"

type autocompleteObjValue = {
    value: string,
    label: ReactNode
}

type Props = {
    className?: string,
    value: string,
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
    containerProps?: {[string]: any},
    extraContainerChildren?: ReactNode
} & (
    {
        onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    }
    |
    {
        customInputElement: (props: HTMLInputElement) => ReactElement<"input">,
    }
)

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
    // $FlowIgnore Flow is silly and can't deal with our union + intersection
    customInputElement,
    // $FlowIgnore
    containerProps,
    extraContainerChildren,
    // $FlowIgnore
    ...otherProps
}: Props, refProp: ?refType): ReactNode {

    if (customInputElement && !refProp) {
        throw Error("If the customInputElement prop is used a ref should also be given.")
    }
    const inputRef = useRef()

    function setRef(elm) {
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

    const customInputElementProps = {
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

export default (
    React.forwardRef<Props, HTMLInputElement>(Input):
        ReactAbstractComponent<Props, HTMLInputElement>
)
