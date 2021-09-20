/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import SvgIconChevron from "../../icons/Chevron";
import type {SortType} from "../ResultsListPage/SortResult.service";
import {useEffect, useRef} from "react";
import {OutsideComponentClick} from "../../effects/OutsideComponentClick";


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

    useEffect(() => {
        if(clickedOutsideComponent !== undefined) {
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


    return (
        <div className="Dropdown">
            <div className={`title ${titlePosition}`}>
                {title}
            </div>
            <div>
                <Options />
            </div>
        </div>
    )
}

export default Dropdown
