/* @flow */


import React, {useEffect, useRef, useState} from 'react'
import ViewOnMapButton from "../ViewOnMapButton";
import {useRouterContext} from "../../contexts/router-context";
import SortResult from "./SortResult";
import Category from "../../constants/Category";
import {getScrollPosition} from "../../effects/scrollPosition";

type Props = {
    orderByCallback: () => {},
    category: Category
}

function Controls({orderByCallback, category}: Props) {

    const [sticky, setSticky] = useState(false);
    const {location} = useRouterContext()
    const ref = useRef<any>(null)
    const scrollPosition = getScrollPosition()

    useEffect(() => {
        setSticky(ref.current && scrollPosition >= ref.current.offsetTop)
    }, [ref, scrollPosition])

    return (
        <div
            className={`Controls ${sticky ? "sticky" : ""}`}
            ref={ref}
        >
            {!sticky &&
                <ViewOnMapButton
                    to={location.pathname.replace(/\/?$/, "/map")}
                />
            }
            <span>
                <SortResult
                    callback={orderByCallback}
                    category={category}
                    titlePosition="left"
                    showDivider={!sticky}
                />
            </span>
        </div>
    )
}

export default Controls
