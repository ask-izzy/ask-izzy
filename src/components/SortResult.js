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
        key: "free_or_low_cost",
        value: true,
        name: "Free or low/cost",
        time: null,
    },
    {
        key: "accessibility",
        value: "fullaccess",
        name: "Full Wheelchair accessible",
        time: null,
    },
    {
        key: "now_open",
        value: {now_open: true},
        name: "Open now (closing soon)",
        time: "close",
    },
    {
        key: "now_open",
        value: {now_open: true},
        name: "Closed or closing late",
        time: "open",
    },
    {
        key: "now_open",
        value: {now_open: false},
        name: "Closed now",
        time: null,
    },
]

function SortResult({orderBy, category, hideOptions}): React.Node {

    const [selection, setSelection] = React.useState(DEFAULT_OPTIONS[0]);
    const [options, setOptions] = React.useState(DEFAULT_OPTIONS);
    const [showOptions, setShowOptions] = React.useState(false);
    const [stickySort, setStickySort] = React.useState(false);

    const ref = React.useRef(null)

    React.useEffect(() => {
        category?.sortingOptions && setOptions(
            options.concat(category.sortingOptions)
        );
    }, []);

    React.useEffect(() => {
        if (showOptions) {
            setShowOptions(hideOptions);
        }
    }, [hideOptions])



    const handleScroll = () => {
        const position = window.pageYOffset;
        if (position < ref.current.offsetTop) {
            setStickySort(false)
        } else if (position >= (ref.current.offsetTop - 24)) {
            setStickySort(true)
        }
    };

    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                {options.map((option, index) => (
                    <div
                        key={`${option.key}_${index}`}
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
        <div
            className={`SortResult ${stickySort ? "sticky" : ""}`}
            ref={ref}
        >
            <div className="orderingSentence">
                Sorting by:
                <div style={{fontWeight: "500"}}>
                    {selection.key ? selection.name : "General sort"}
                </div>
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
