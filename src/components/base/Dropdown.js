/* @flow */

import * as React from "react";
import type {Node as ReactNode, Element as ReactElement} from "react";
import SvgIconChevron from "../../icons/Chevron";
import type {SortType} from "../ResultsListPage/SortResult.service";
import {useEffect, useRef} from "react";
import {OutsideComponentClick} from "../../effects/OutsideComponentClick";
import {MobileDetect} from "../../effects/MobileDetect";


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
        <div ref={ref}>
            <div
                aria-labelledby="sortOptions"
                className={`optionSelect ${
                    showOptions ? "activeOptionSelect open" : "closed"}`}
                onClick={() => setShowOptions(!showOptions)}
            >
                {selection.name} <SvgIconChevron fill={"black"}/>
            </div>
            {showOptions &&
            <div className="options">
                {options.map((option, index) => (
                    <div
                        id="sortOptions"
                        aria-live="polite"
                        key={`${option.key || "key"}_${index}`}
                        className={
                            option.name === selection.name ? "selected" : ""
                        }
                        onClick={() => {
                            setShowOptions(false);
                            onChange(option);
                        }}
                    >
                        {option.name}
                    </div>
                ))}
            </div> }
        </div>
    )

    const NativeSelect = (): ReactElement<"select"> => (
        <select
            value={selection.key}
            onChange={(evt) => {
                const opt = options.find(
                    item => item.key === evt.target.value
                )
                onChange(opt || options[0]);
            }}
        >
            {options.map(opt => (
                <option value={opt.key}>
                    {opt.name}
                </option>
            ))}
        </select>
    )


    return (
        <div className="Dropdown">
            <div className={`title ${titlePosition}`}>
                {title}
            </div>
            {isMobile ?
                <NativeSelect />
                : <div>
                    <Options />
                </div>
            }
        </div>
    )
}

export default Dropdown
