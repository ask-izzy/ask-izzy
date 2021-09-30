/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react"
import Dropdown from "./../base/Dropdown";
import type {SortType} from "./SortResult.service";

const OPTIONS: Array<SortType> = [
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
    callback: function,
    titlePosition: string,
    showDivider: boolean,
}

function SortResult(
    {
        callback,
        titlePosition,
        showDivider,
    }: Props): ReactNode {

    const [selection, setSelection] = React.useState<SortType>(
        OPTIONS[0]
    );

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
                title="Sort by"
                titlePosition={titlePosition}
                selection={selection}
                options={OPTIONS}
            />
        </div>
    )
}

export default SortResult
