/* @flow */

import * as React from "react"
import SortResult from "./SortResult";
import FilterResult from "./FilterResult";
import Category from "../constants/Category";
import icons from "../icons";


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
        loading,
    }: Props): React.Node {

    const [stickySort, setStickySort] = React.useState(false);

    const ref = React.useRef<any>(null)

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


    return (
        <div
            className={`SortFilterResult ${stickySort ? "sticky" : ""}`}
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

SortFilterResult.defaultProps = {
    loading: false,
}

export default SortFilterResult
