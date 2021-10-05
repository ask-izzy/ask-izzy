/* @flow */


import type {Node as ReactNode} from "react";
import React, {useEffect, useRef, useState} from "react";
import ViewOnMapButton from "../ViewOnMapButton";
import {useRouterContext} from "../../contexts/router-context";
import SortResult from "./SortResult";
import {getScrollPosition} from "../../effects/scrollPosition";
import type {SortType} from "./SortResult.service";
import ResultsPageGeolocationButton from
    "../../pages/ResultsPageGeolocationButton";
import {MobileDetect} from "../../effects/MobileDetect";

type Props = {
    orderByCallback: (SortType) => void,
}

function Controls(
    {
        orderByCallback,
    }: Props): ReactNode {

    const [sticky, setSticky] = useState(false);
    const [initialOffset, setInitialOffset] = useState(0);
    const {location} = useRouterContext()
    const ref = useRef<any>(null)
    const scrollPosition = getScrollPosition()

    const isMobile = MobileDetect(556)

    useEffect(() => {

        // sets the initial offset of the controls
        // this will also account for alerts
        if (!initialOffset) {
            setInitialOffset(ref?.current?.offsetTop)
        }

        setSticky(initialOffset && scrollPosition >= initialOffset)
    }, [ref, scrollPosition])

    const renderResultsPageGeolocationButton = () => (
        <ResultsPageGeolocationButton
            showMessage={true}
        />
    )

    return (
        <div className={`ResultsListControls ${sticky ? "sticky" : ""}`}>
            <div
                className={`Controls ${sticky ? "sticky" : ""}`}
                ref={ref}
            >
                {!sticky &&
                    <ViewOnMapButton
                        to={location.pathname.replace(/\/?$/, "/map")}
                    />
                }
                {isMobile && !sticky && renderResultsPageGeolocationButton()}
                <span className="dropDownContainer">
                    <SortResult
                        callback={orderByCallback}
                        titlePosition="left"
                        showDivider={!sticky}
                    />
                </span>
            </div>
            {!isMobile && renderResultsPageGeolocationButton()}
        </div>
    )
}

export default Controls
