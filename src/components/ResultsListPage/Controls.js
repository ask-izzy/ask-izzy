/* @flow */


import React from 'react'
import ViewOnMapButton from "../ViewOnMapButton";
import {useRouterContext} from "../../contexts/router-context";
import SortResult from "./SortResult";
import Category from "../../constants/Category";

type Props = {
    orderByCallback: () => {},
    category: Category
}

function Controls({orderByCallback, category}: Props) {

    const {location} = useRouterContext()

    return (
        <div className="Controls">
            <ViewOnMapButton
                to={location.pathname.replace(/\/?$/, "/map")}
            />
            <span>
                <SortResult
                    callback={orderByCallback}
                    category={category}
                    titlePosition="left"
                />
            </span>
        </div>
    )
}

export default Controls
