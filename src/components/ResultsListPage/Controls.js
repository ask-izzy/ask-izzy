/* @flow */


import type {Node as ReactNode} from "react";
import React, {useEffect, useRef, useState} from "react";
import ViewOnMapButton from "../ViewOnMapButton";
import {useRouterContext} from "../../contexts/router-context";
import SortResult, {SORT_OPTIONS} from "./SortResult";
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
    const [sortOption, setSortOption] = useState<SortType>(SORT_OPTIONS[0])
    const {location} = useRouterContext()
    const ref = useRef<any>(null)
    const scrollPosition = getScrollPosition()

    const isMobile = MobileDetect(556)

    useEffect(() => {

        // sets the initial offset of the controls
        // this will also account for alerts
        if (!initialOffset) {
            // because the control component is a lot taller on mobile than
            // it is on desktop which is why we need to calculate the
            // offset differently. The + 44 is to account for the height of the
            // app bar
            if (isMobile) {
                setInitialOffset(
                    ref?.current?.getBoundingClientRect().bottom + 44
                )
            } else {
                setInitialOffset(ref?.current?.offsetTop)
            }
        }

        setSticky(initialOffset > 0 && scrollPosition >= initialOffset)
    }, [ref, scrollPosition])

    const renderResultsPageGeolocationButton = () => (
        <ResultsPageGeolocationButton
            showMessage={true}
        />
    )

    const sortResult = () => (
        <span className="dropDownContainer">
            <SortResult
                callback={(option) => {
                    setSortOption(option)
                    orderByCallback(option)
                }}
                sortOption={sortOption}
                titlePosition="left"
                showDivider={!sticky}
            />
        </span>
    )

    const renderStickyControlBar = () => (
        <div
            className="Controls sticky"
        >
            {sortResult()}
        </div>
    )

    return (
        <div
            className="ResultsListControls"
            ref={ref}
        >
            {/*To make the transition from non-sticky to*/}
            {/*sticky smoother we won't remove the non-sticky controls*/}
            {/*from the DOM but rather only load the sticky*/}
            {/*version if applicable*/}
            {sticky && renderStickyControlBar()}
            <div className="Controls">
                <ViewOnMapButton
                    to={location.pathname.replace(/\/?$/, "/map")}
                />
                {isMobile && renderResultsPageGeolocationButton()}
                {sortResult()}
            </div>
            {!isMobile && renderResultsPageGeolocationButton()}
        </div>
    )
}

export default Controls
