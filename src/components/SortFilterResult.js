/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react"
import SortResult from "./SortResult";
import FilterResult from "./FilterResult";
import Category from "../constants/Category";
import icons from "../icons";
import {getScrollPosition} from "../effects/scrollPosition";


type Props = {
    orderByCallback: function,
    filterByCallback: function,
    category: ?Category,
    loading?: ?boolean,
}

function SortFilterResult(
    {
        orderByCallback,
        filterByCallback,
        category,
        loading = false,
    }: Props): ReactNode {


    const ref = React.useRef<any>(null)

    const scrollPosition = getScrollPosition()

    return (
        <div
            className={`SortFilterResult ${
                ref.current && scrollPosition >= ref.current.offsetTop ?
                    "sticky" : ""
            }`}
            ref={ref}
        >
            <SortResult
                titlePosition="left"
                category={category}
                callback={(orderBy) => {
                    orderByCallback(orderBy)
                }}
            />
            <div>
                {loading && <icons.Loading className="big" />}
            </div>
            <FilterResult
                titlePosition="right"
                category={category}
                callback={(filterBy) => {
                    filterByCallback(filterBy)
                }}
            />
        </div>
    )
}

export default SortFilterResult
