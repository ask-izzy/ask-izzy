/* @flow */

import type {Node as ReactNode} from "React";
import React, {useContext} from "react";

import IconButton from "./IconButton";
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
    hideLogoWhenNotABar?: boolean,
    onBackTouchTap?: ?Function,
    backMessage?: string,
    containerClassName?: ?string,
    breakpoint? : number,
}

const LOGO = "/static/images/ask-izzy-logo-single-line-yellow.svg";
const STICKY_HEADER_BREAKPOINT = 50;

function AppBar(
    {
        onBackTouchTap,
        backMessage,
        containerClassName,
        transition,
        hideLogoWhenNotABar,
        breakpoint = STICKY_HEADER_BREAKPOINT,
    }: Props): ReactNode {

    const scrollPosY = getScrollPosition();

    const {router} = useContext(routerContext);

    const unsetSavedAnswersForCategory = (category: Category): void => {
        const savedAnswers = category.personalisation.filter(personalisation =>
            personalisation.title.toString().toLowerCase() !== "location"
        ).map(cat => cat.defaultProps.name)
        savedAnswers.forEach(answer => {
            Storage.removeItem(answer)
        })
    }

    const goHome = (): void => {
        const category = categories.find(category =>
            category.key === router.match.params.page
        )
        if (category && router.match.params?.subpage) {
            unsetSavedAnswersForCategory(category)
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
                className={classnames("AppBar", showBar())}
            >
                {(
                    !hideLogoWhenNotABar ||
                    !transition ||
                    scrollPosY > breakpoint
                ) && (
                    <IconButton
                        className={
                            !onBackTouchTap ? "appBarLogo" : undefined
                        }
                        name={onBackTouchTap ? backMessage
                            : "Ask Izzy home page;"
                        }
                        onClick={onBackTouchTap || goHome}
                        analyticsEvent={{
                            event: "Action Triggered - Back",
                            eventAction: "Navigate back",
                            eventLabel: null,
                        }}
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
                                alt="Ask Izzy home"
                            />
                        )}
                    </IconButton>
                )}
                <QuickExit
                    className={showBar()}
                />
            </div>
        </div>
    )
}

AppBar.defaultProps = {
    transition: false,
    hideLogoWhenNotABar: false,
}

export default AppBar;
