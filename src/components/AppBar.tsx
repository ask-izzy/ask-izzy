import React from "react";
import { useRouter } from "next/router"
import classnames from "classnames";

import IconButton from "@/src/components/IconButton";
import ChevronBack from "@/src/icons/ChevronBack"
import QuickExit from "@/src/components/QuickExit";
import {getScrollPosition} from "@/src/effects/scrollPosition";
import Storage from "@/src/storage";
import categories from "@/src/constants/categories";
import Category from "@/src/constants/Category";
import MyListButton from "@/src/components/MyListButton"

type Props = {
    transition?: boolean,
    hideLogoWhenNotABar?: boolean,
    onBackTouchTap?: () => Promise<boolean> | null | void,
    backMessage?: string,
    containerClassName?: string | null,
    breakpoint? : number,
}

const LOGO = "/images/ask-izzy-logo-single-line-yellow.svg";
const STICKY_HEADER_BREAKPOINT = 50;

function AppBar({
    onBackTouchTap,
    backMessage,
    containerClassName,
    transition = false,
    hideLogoWhenNotABar = false,
    breakpoint = STICKY_HEADER_BREAKPOINT,
}: Props) {

    const scrollPosY = getScrollPosition();

    const router = useRouter();

    const unsetSavedAnswersForCategory = (category: Category): void => {
        const savedAnswers = category.personalisation.filter(personalisation =>
            personalisation.title.toString().toLowerCase() !== "location",
        ).map(cat => cat.name)
        savedAnswers.forEach(answer => {
            Storage.removeItem(answer)
        })
    }

    const goHome = (): void => {
        const category = categories.find(category =>
            category.key === router.query.categoryOrContentPageSlug,
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
                <div className={classnames(showBar(), "widget-container")}>
                    <MyListButton />
                    <QuickExit
                        className={showBar()}
                    />
                </div>
            </div>
        </nav>
    )
}

export default AppBar;
