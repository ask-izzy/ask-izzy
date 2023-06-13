import React, {useRef, ForwardedRef, ReactNode, ReactElement} from "react"
import cnx from "classnames"

import Button from "@/src/components/base/Button.js"

export type Props = {
    className?: string
    value: string
    icon?: ReactNode
    iconPosition?: "left" | "right"
    showClearButton?: boolean
    onKeyDown?: (arg0: React.KeyboardEvent<HTMLInputElement>) => void
    onBlur?: (arg0: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (arg0: React.FocusEvent<HTMLInputElement>) => void
    containerProps?: Record<string, any>
    extraContainerChildren?: ReactNode
    type?: string
    placeholder?: string | undefined
} & (
    {
        onChange?: (arg0: React.SyntheticEvent<HTMLInputElement>) => void
        customInputElement?: undefined
    } | {
        customInputElement?: (
            arg0: {
                className: string,
                onChange: ((arg0: React.SyntheticEvent<HTMLInputElement, Event>) => void) | undefined,
                value: string,
            }
        ) => ReactElement<"input">
        onChange?: undefined
    }
)

function Input({
    className,
    value,
    icon,
    iconPosition = "left",
    showClearButton = false,
    customInputElement = undefined,
    containerProps,
    extraContainerChildren,
    ...otherProps
}: Props, ref: ForwardedRef<HTMLInputElement>) {

    if (customInputElement && !ref) {
        throw Error("If the customInputElement prop is used a ref should also be given.")
    }

    const inputRef = (ref && typeof ref !== "function") ? ref : useRef()

    function setRef(elm) {
        inputRef.current = elm
        if (typeof ref === "function") {
            ref(elm)
        } else if (ref) {
            ref.current = elm
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
                        },
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
                                "value",
                            )?.set
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
                    },
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
    React.forwardRef<HTMLInputElement, Props>(Input)
)
