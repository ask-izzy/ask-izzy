/* @flow */

import type {Node as ReactNode} from "react"
import React, {useEffect, useState} from "react";
import Button from "../base/Button";
import Chevron from "../../icons/chevron.svg";
import {getScrollPosition} from "../../effects/scrollPosition";

type Props = {
    label: string,
}

function ScrollToTop({label}: Props): ReactNode {

    const [currentScrollPos, setCurrentScrollPos] = useState(0)
    const [showButton, setShowButton] = useState(false)

    const scrollPos = getScrollPosition()

    useEffect(() => {
        if (scrollPos < currentScrollPos && !showButton) {
            setShowButton(true)
            setCurrentScrollPos(scrollPos)
        } else if (scrollPos > currentScrollPos && showButton) {
            setShowButton(false)
        } else {
            setCurrentScrollPos(scrollPos)
        }

        if (scrollPos === 0) {
            setCurrentScrollPos(0)
            setShowButton(false)
        }

    }, [scrollPos])

    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }
    }

    return (
        <div className="ScrollToTop">
            <Button
                className={`button ${showButton ? "showToTop" : ""}`}
                disabled={!showButton}
                onClick={scrollToTop}
                analyticsEvent={{
                    event: `Action Triggered - Scroll To Top Button`,
                    eventAction: `Scroll to top requested`,
                    eventLabel: null,
                }}
            >
                <Chevron/>
                <span>{label}</span>
            </Button>
        </div>
    )
}

export default ScrollToTop
