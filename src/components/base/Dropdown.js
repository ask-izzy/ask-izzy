/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import SvgIconChevron from "../../icons/Chevron";
import type {SortType} from "../ResultsListPage/SortResult.service";
import {useEffect, useRef, useState} from "react";
import {OutsideComponentClick} from "../../effects/OutsideComponentClick";
import {MobileDetect} from "../../effects/MobileDetect";
import * as gtm from "../../google-tag-manager";


type Props = {
    selection: SortType,
    options: Array<SortType>,
    onChange: function,
    title: string,
}

function Dropdown(
    {
        selection,
        options,
        onChange,
        title,
    }: Props): ReactNode {

    const rootElmRef = useRef(null)

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const clickedOutsideComponent = OutsideComponentClick(rootElmRef)

    const isMobile = MobileDetect()

    useEffect(() => {
        if (clickedOutsideComponent !== undefined && !isMobile) {
            setShowOptions(!clickedOutsideComponent)
        }
    }, [clickedOutsideComponent])

    const dropDownEventHandler = (option: SortType): void => {
        setShowOptions(false);
        onChange(option);
        gtm.emit({
            event: `Action Triggered - Dropdown`,
            eventCat: "Action triggered",
            eventAction: `${showOptions ? "Open" : "Close"} dropdown`,
            eventLabel: option.name,
            eventValue: showOptions ? 0 : 1,
            sendDirectlyToGA: true,
        });
    }

    /**
     * Sets the focus of the correct option
     */
    useEffect(() => {
        if (showOptions) {
            // If an option has been selected it will focus that option
            if (selection.value) {
                const selectedIndex = options.findIndex(
                    opt => opt.key === selection.key
                );
                const selectedFocus = document.getElementById(
                    `dropdownOption_${selectedIndex}`)
                selectedFocus && selectedFocus.focus();
            } else if (options.length) {
                const defaultFocus = document.getElementById(
                    "dropdownOption_0"
                )
                defaultFocus && defaultFocus.focus()
            }
        }
    }, [showOptions])

    const keyboardListNavigation = (
        event: SyntheticKeyboardEvent<HTMLDivElement>,
        index: number) => {
        if (event.key === "ArrowDown") {
            const nextOption = document.getElementById(
                `dropdownOption_${
                    index + 1
                }`)
            nextOption && nextOption.focus();
        } else if (event.key === "ArrowUp") {
            const prevOption = document.getElementById(
                `dropdownOption_${
                    index - 1
                }`)
            prevOption && prevOption.focus();
        } else if (event.key === "Escape") {
            setShowOptions(false)
        } else if (event.key === "Home") {
            const firstOption = document.getElementById(
                "dropdownOption_0"
            )
            firstOption && firstOption.focus()
        } else if (event.key === "End") {
            const lastOption = document.getElementById(
                `dropdownOption_${options.length - 1}`
            )
            lastOption && lastOption.focus()
        }
    }

    const Options = (): ReactNode => (
        <div
            ref={rootElmRef}
            className="optionsContainer"
            role="listbox"
        >
            <div
                tabIndex="0"
                aria-labelledby="dropdownOptions"
                className={`optionSelect ${
                    showOptions ? "activeOptionSelect open" : "closed"}`}
                onClick={() => setShowOptions(!showOptions)}
                onKeyDown={(event) => {
                    event.preventDefault()
                    if (event.key === "Enter" ||
                        // The " " is the Space key
                        event.key === " ") {
                        setShowOptions(!showOptions)
                    }
                }}
                aria-expanded={showOptions}
            >
                {selection.name} <SvgIconChevron fill={"black"}/>
            </div>
            {showOptions &&
            <div className="options">
                {options.map((option, index) => (
                    <div
                        id={`dropdownOption_${index}`}
                        role="option"
                        tabIndex={index === 0 ? 0 : -1}
                        aria-live="polite"
                        key={`${option.key || "key"}_${index}`}
                        className={
                            option.name === selection.name ? "selected" : ""
                        }
                        aria-selected={option.name === selection.name}
                        onClick={() => {
                            dropDownEventHandler(option)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" ||
                                // The " " is the Space key
                                event.key === " ") {
                                dropDownEventHandler(option)
                            } else {
                                keyboardListNavigation(event, index)
                            }
                        }}
                    >
                        {option.name}
                    </div>
                ))}
            </div> }
        </div>
    )

    return (
        <div className="Dropdown">
            <div className="title">
                {title}
            </div>
            {isMobile ?
                <select
                    className="nativeSelect"
                    value={selection.key}
                    onChange={(evt) => {
                        const opt = options.find(
                            item => item.key === evt.target.value
                        )
                        onChange(opt || options[0]);
                    }}
                >
                    {options.map((opt, index) => (
                        <option
                            value={opt.key}
                            key={`${opt.key || "key"}_${index}`}
                        >
                            {opt.name}
                        </option>
                    ))}
                </select>
                : <Options />
            }
        </div>
    )
}

export default Dropdown
