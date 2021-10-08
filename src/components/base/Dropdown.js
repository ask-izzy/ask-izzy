/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import SvgIconChevron from "../../icons/Chevron";
import type {SortType} from "../ResultsListPage/SortResult.service";
import {useEffect, useRef} from "react";
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

    const [showOptions, setShowOptions] = React.useState<boolean>(false);

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
                    if (event.key === "Enter") {
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
                        id="dropdownOptions"
                        role="option"
                        tabIndex="0"
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
                            if (event.key === "Enter") {
                                dropDownEventHandler(option)
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
