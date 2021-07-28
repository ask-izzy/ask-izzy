/* @flow */

import type {Node as ReactNode} from "React";
import React, {useContext} from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";
import classnames from "classnames";
import routerContext from "../contexts/router-context";
import {getScrollPosition} from "../effects/scrollPosition";
import ScreenReader from "./ScreenReader";
type Props = {
    transition?: boolean,
    home?: boolean,
    onBackTouchTap?: ?Function,
    backMessage?: string,
    fixedSizeQuickExit?: boolean,
    containerClassName?: ?string,
    breakpoint? : number,
}

const LOGO = "/static/images/ask-izzy-logo-single-line-yellow.svg";
const STICKY_HEADER_BREAKPOINT = 50;

function AppBar(
    {
        onBackTouchTap,
        backMessage,
        fixedSizeQuickExit,
        containerClassName,
        transition,
        home,
        breakpoint = STICKY_HEADER_BREAKPOINT,
    }: Props): ReactNode {

    const scrollPosY = getScrollPosition();

    const {router} = useContext(routerContext);

    const goHome = (): void => {
        router.navigate("/");
    }

    const showBar = (): string => (
        !transition || scrollPosY > breakpoint ?
            "showBar" : ""
    )


    return (
        <div
            role="navigation"
            className={
                classnames(containerClassName, "AppBarContainer")
            }
            aria-labelledby="appBar"
        >
            <div className={
                classnames("AppBar", home ?
                    "HomPageAppBar" : undefined, showBar())
            }
            >
                <ScreenReader>
                    <span id="appBar">
                        Banner navigation.
                    </span>
                </ScreenReader>
                {!home ||
                (!transition || scrollPosY > breakpoint) ? (
                        <components.IconButton
                            className={
                                !onBackTouchTap ? "appBarLogo" : undefined
                            }
                            onClick={onBackTouchTap || goHome}
                        >
                            {onBackTouchTap ? (
                                <span className="backButton">
                                    <icons.ChevronBack />
                                    <span className="back-label">
                                        {backMessage}
                                    </span>
                                </span>
                            ) : (
                                <img
                                    src={LOGO}
                                    alt="AskIzzy"
                                />
                            )}
                        </components.IconButton>
                    ) : null}
                <QuickExit
                    className={showBar()}
                    fixedSize={fixedSizeQuickExit}
                />
            </div>
        </div>
    )
}

AppBar.defaultProps = {
    transition: false,
    home: false,
}

export default AppBar;
