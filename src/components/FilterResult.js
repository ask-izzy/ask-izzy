/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react"
import Dropdown from "./Dropdown";
import Category from "../constants/Category";
import type {SortType} from "./SortResult.service";

const DEFAULT_OPTIONS:Array<SortType> = [
    {
        key: null,
        value: null,
        name: "No filter",
    },
    {
        key: "free_or_low_cost",
        value: true,
        name: "Free or low/cost",
    },
    {
        key: "statewide",
        value: true,
        name: "State wide",
    },
    {
        key: "catchment",
        value: true,
        name: "In my area",
    },
    {
        key: "healthcare_card_holders",
        value: true,
        name: "Health care card",
    },
    {
        key: "ndis_approved",
        value: true,
        name: "NDIS approved",
    },
]

type Props = {
    callback: function,
    category: ?Category,
    titlePosition: string,
}

function FilterResult(
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
        category?.sortingOptions && setOptions(
            options.concat(category.sortingOptions)
        );
    }, []);


    return (
        <div className="FilterResult">
            <Dropdown
                onChange={(option) => {
                    setSelection(option);
                    callback(option);
                }}
                title="Filter By"
                titlePosition={titlePosition}
                selection={selection}
                options={options}
            />
        </div>
    )
}

export default FilterResult
