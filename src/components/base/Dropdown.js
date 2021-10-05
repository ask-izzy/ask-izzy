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
    titlePosition: string,
}

function Dropdown(
    {
        selection,
        options,
        onChange,
        title,
        titlePosition,
    }: Props): ReactNode {

    const ref = useRef(null)

    const [showOptions, setShowOptions] = React.useState<boolean>(false);

    const clickedOutsideComponent = OutsideComponentClick(ref)

    const isMobile = MobileDetect()

    useEffect(() => {
        if (clickedOutsideComponent !== undefined && !isMobile) {
            setShowOptions(!clickedOutsideComponent)
        }
    }, [clickedOutsideComponent])

    const Options = (): ReactNode => (
        <div
            ref={ref}
            className="optionsContainer"
        >
            <div
                tabIndex="0"
                aria-labelledby="options"
                className={`optionSelect ${
                    showOptions ? "activeOptionSelect open" : "closed"}`}
                onClick={() => setShowOptions(!showOptions)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        setShowOptions(!showOptions)
                    }
                }}
            >
                {selection.name} <SvgIconChevron fill={"black"}/>
            </div>
            {showOptions &&
            <div className="options">
                {options.map((option, index) => (
                    <div
                        id="options"
                        tabIndex="0"
                        aria-live="polite"
                        key={`${option.key || "key"}_${index}`}
                        className={
                            option.name === selection.name ? "selected" : ""
                        }
                        onClick={() => {
                            setShowOptions(false);
                            onChange(option);
                            gtm.emit({
                                event: `Action Triggered - Dropdown`,
                                eventCat: "Action triggered",
                                eventAction: `Dropdown`,
                                eventLabel: option.name,
                                sendDirectlyToGA: true,
                            });
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                setShowOptions(false);
                                onChange(option);
                                gtm.emit({
                                    event: `Action Triggered - Dropdown`,
                                    eventCat: "Action triggered",
                                    eventAction: `Dropdown`,
                                    eventLabel: option.name,
                                    sendDirectlyToGA: true,
                                });
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
            <div className={`title ${titlePosition}`}>
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
