/* @flow */

import * as React from "react"
import Dropdown from "./Dropdown";
import icons from "../icons";
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
    loading: ?boolean,
}

function FilterResult(
    {
        callback,
        category,
        loading,
    }: Props): React.Node {

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
            <div className="sentence">
                Filtering by:
                <div style={{fontWeight: "500"}}>
                    {selection.key ? selection.name : "No filter"}
                </div>
            </div>
            <div>
                {loading && <icons.Loading className="big" />}
            </div>
            <Dropdown
                onChange={(option) => {
                    setSelection(option);
                    callback(option);
                }}
                title="Filter By"
                selection={selection}
                options={options}
            />
        </div>
    )
}

FilterResult.defaultProps = {
    loading: false,
}

export default FilterResult
