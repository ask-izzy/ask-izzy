/* @flow */

import type {Node as ReactNode} from "React";
import React, {useContext} from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";
import classnames from "classnames";
import routerContext from "../contexts/router-context";
import {getScrollPosition} from "../effects/scrollPosition";
import Storage from "../storage";
import categories from "../constants/categories";
import Category from "../constants/Category";

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

    const removeCategoryAnswers = (category: Category): void => {
        const answers = category.personalisation.filter(personalisation =>
            personalisation.title.toString().toLowerCase() !== "location"
        ).map(cat => cat.defaultProps.name)
        answers.forEach(answer => {
            Storage.removeItem(answer)
        })
    }

    const goHome = (): void => {
        const category = categories.find(category =>
            category.key === router.match.params.page
        )
        if (category && router.match.params?.subpage) {
            removeCategoryAnswers(category)
        }

        if (router.location.pathname === "/") {
            window.scrollTo(0, 0);
        } else {
            router.navigate("/");
        }
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
            <div
                id="appBar"
                aria-label="Banner."
                className={
                    classnames("AppBar", home ?
                        "HomPageAppBar" : undefined, showBar())
                }
            >
                {!home ||
                (!transition || scrollPosY > breakpoint) ? (
                        <components.IconButton
                            className={
                                !onBackTouchTap ? "appBarLogo" : undefined
                            }
                            name={onBackTouchTap ? backMessage
                                : "Ask Izzy home page;"
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
                                    alt="Ask izzy home"
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
