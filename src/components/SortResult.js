/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react"
import Dropdown from "./Dropdown";
import Category from "../constants/Category";
import type {SortType} from "./SortResult.service";
import Storage from "../storage";

const DEFAULT_OPTIONS: Array<SortType> = [
    {
        key: null,
        value: null,
        name: "please select option",
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
        name: "Open now",
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
]

type Props = {
    callback: function,
    category: ?Category,
    titlePosition: string,
}

function SortResult(
    {
        callback,
        category,
        titlePosition,
    }: Props): ReactNode {

    const [selection, setSelection] = React.useState<SortType>(
        DEFAULT_OPTIONS[0]
    );
    const [options, setOptions] = React.useState<Array<SortType>>(
        DEFAULT_OPTIONS
    );

    React.useEffect(() => {
        const newOptions = [...options]
        const location = Storage.getLocation();
        if (location) {
            const locationArr = location.replace(" ", "").split(",");
            const state = locationArr[1];
            newOptions.push({
                key: "catchment",
                value: state,
                name: "Nearest to me",
                time: null,
            })
        }
        category?.sortingOptions && setOptions(
            newOptions.concat(category.sortingOptions)
        );
    }, []);


    return (
        <div className="SortResult">
            <Dropdown
                onChange={(option) => {
                    setSelection(option);
                    callback(option);
                }}
                title="Order By"
                titlePosition={titlePosition}
                selection={selection}
                options={options}
            />
        </div>
    )
}

export default SortResult
