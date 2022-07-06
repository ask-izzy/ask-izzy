/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import { useRouter } from "next/router"

import IconButton from "./IconButton";
import ChevronBack from "../icons/ChevronBack"
import QuickExit from "./QuickExit";
import classnames from "classnames";
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

const LOGO = "/images/ask-izzy-logo-single-line-yellow.svg";
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

    const router = useRouter();

    const unsetSavedAnswersForCategory = (category: Category): void => {
        const savedAnswers = category.personalisation.filter(personalisation =>
            personalisation.title.toString().toLowerCase() !== "location"
        ).map(cat => cat.name)
        savedAnswers.forEach(answer => {
            Storage.removeItem(answer)
        })
    }

    const goHome = (): void => {
        const category = categories.find(category =>
            category.key === router.query.categoryOrContentPageSlug
        )
        if (category && router.query?.personalisationPage) {
            unsetSavedAnswersForCategory(category)
        }

        if (router.asPath === "/") {
            window.scrollTo(0, 0);
        } else {
            router.push("/");
        }
    }

    const showBar = (): string => (
        !transition || scrollPosY > breakpoint ?
            "showBar" : ""
    )


    return (
        <nav
            className={
                classnames(containerClassName, "AppBarContainer")
            }
            aria-label="Site"
        >
            <div
                id="appBar"
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
                            : "Link to home page"
                        }
                        onClick={onBackTouchTap || goHome}
                        analyticsEvent={{
                            event: "Action Triggered - Back",
                            eventAction: "Navigate back",
                            eventLabel: null,
                        }}
                    >
                        {onBackTouchTap ? (
                            <span
                                className="backButton"
                                aria-hidden="true"
                            >
                                <ChevronBack />
                                <span className="back-label">
                                    {backMessage}
                                </span>
                            </span>
                        ) : (
                            <img
                                src={LOGO}
                                alt="Ask Izzy home"
                                aria-hidden="true"
                            />
                        )}
                    </IconButton>
                )}
                <QuickExit
                    className={showBar()}
                />
            </div>
        </nav>
    )
}

AppBar.defaultProps = {
    transition: false,
    hideLogoWhenNotABar: false,
}

export default AppBar
