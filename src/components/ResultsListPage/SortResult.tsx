import React, {useEffect} from "react"

import Dropdown, {SortType} from "@/src/components/base/Dropdown.js";

export const SORT_OPTIONS: Array<SortType> = [
    {
        key: "",
        value: "",
        name: "Best match",
    },
    {
        key: "now_open",
        value: {now_open: true},
        name: "Open now",
    },
]

type Props = {
    callback: (option: any) => void,
    showDivider: boolean,
    sortOption: SortType,
    hideOptionsOnScrollBreakpoint?: number
}

function SortResult({
    callback,
    showDivider,
    sortOption,
    hideOptionsOnScrollBreakpoint = 0,
}: Props) {

    const [selection, setSelection] = React.useState<SortType>(
        SORT_OPTIONS[0],
    );

    useEffect(() => {
        if (sortOption) {
            setSelection(sortOption)
        }
    }, [sortOption])

    return (
        <div className="SortResult">
            {showDivider && <div className="divider"/>}
            <Dropdown
                onChange={(option) => {
                    // When changing the sort option, we will scroll to the
                    // top of the screen, but only if the option
                    // is different to what's currently selected
                    if (typeof window !== "undefined" &&
                        selection !== option) {
                        window.scrollTo(0, 0)
                    }
                    setSelection(option);
                    callback(option);
                }}
                analyticsEvent={{
                    event: "Action Triggered - Sort Options Dropdown",
                    eventAction: "Show sort options",
                }}
                hideOptionsOnScrollBreakpoint={
                    hideOptionsOnScrollBreakpoint
                }
                title="Sort by"
                selection={selection}
                options={SORT_OPTIONS}
            />
        </div>
    )
}

export default SortResult
