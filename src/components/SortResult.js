/* @flow */

import * as React from "react"
import SvgIconChevron from "../icons/Chevron";

const DEFAULT_OPTIONS = [
    {
        key: null,
        value: null,
        name: "please select option",
        time: null,
    },
    {
        key: "accessibility",
        value: "fullaccess",
        name: "Wheelchair Accessible",
        time: null,
    },
    {
        key: "now_open",
        value: {now_open: true},
        name: "Open Now",
        time: "local_time",
    },
    {
        key: "now_open",
        value: {now_open: false},
        name: "Closed Now",
        time: "local_time",
    },
]

function SortResult({orderBy, category}): React.Node {

    const [selection, setSelection] = React.useState(DEFAULT_OPTIONS[0])
    const [options, setOptions] = React.useState(DEFAULT_OPTIONS)
    const [showOptions, setShowOptions] = React.useState(false)

    React.useEffect(() => {
        category.sortingOptions && setOptions(
            options.concat(category.sortingOptions)
        )
    }, [])

    const SortOptions = () => (
        <div>
            <div
                className={`optionSelect ${
                    showOptions ? "activeOptionSelect open" : "closed"}`}
                onClick={() => setShowOptions(!showOptions)}
            >
                {selection.name} <SvgIconChevron fill={"black"}/>
            </div>
            {showOptions && <div className="options">
                {options.map(option => (
                    <div
                        key={option.key}
                        onClick={() => {
                            setShowOptions(!showOptions)
                            setSelection(option)
                            orderBy(option)
                        }}
                    >
                        {option.name}
                    </div>
                ))}
            </div> }
        </div>
    )

    return (
        <div className="SortResult">
            <div className="orderingSentence">
                Sorting by: {selection.key ? selection.name : "General sort"}
            </div>
            <div className="orderingControls">
                <div className="orderByTitle">
                    Order By
                </div>
                <div>
                    <SortOptions />
                </div>
            </div>
        </div>
    )
}

export default SortResult
