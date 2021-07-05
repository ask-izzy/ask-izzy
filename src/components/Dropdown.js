/* @flow */

import * as React from "react";
import SvgIconChevron from "../icons/Chevron";
import type {SortType} from "./SortResult.service";

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
    }: Props): React.Node {

    const [showOptions, setShowOptions] = React.useState<boolean>(false);


    const Options = (): React.Node => (
        <div>
            <div
                className={`optionSelect ${
                    showOptions ? "activeOptionSelect open" : "closed"}`}
                onClick={() => setShowOptions(!showOptions)}
            >
                {selection.name} <SvgIconChevron fill={"black"}/>
            </div>
            {showOptions && <div className="options">
                {options.map((option, index) => (
                    <div
                        key={`${option.key || "key"}_${index}`}
                        onClick={() => {
                            setShowOptions(!setShowOptions);
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
