/* @flow */

import * as React from "react";
import AppBar from "./AppBar";
import {useEffect, useState} from "react";

type AppBarProps = React.ElementProps<typeof AppBar>

type Props = {
    primaryText: string | React.Node,
    secondaryText?: string | React.Node,
    infoText?: string | React.Node,
    children?: React.Node,
    bannerName: string,
    className?: string,
    taperColour?: string,
    fixedAppBar?: boolean,
    hideLogoWhenNotABar?: boolean,
    goBack?: {
        onBackTouchTap?: $PropertyType<AppBarProps, 'onBackTouchTap'>,
        backMessage?: $PropertyType<AppBarProps, 'backMessage'>,
    },
}

function HeaderBar(
    {
        bannerName,
        className,
        taperColour,
        primaryText,
        children,
        secondaryText,
        infoText,
        fixedAppBar,
        hideLogoWhenNotABar,
        goBack = {},
    }: Props): React.Node {


    const [headerBarClassName, setHeaderBarClassName] = useState("HeaderBar")

    useEffect(() => {
        let newHeaderName = headerBarClassName
        if (bannerName) {
            newHeaderName += ` ${bannerName}`;
        }

        if (!getOlderSafari()) {
            newHeaderName += " showTaper"
        }

        if (className) {
            newHeaderName += ` ${className}`;
        }

        if (taperColour) {
            newHeaderName += ` taperColour${taperColour}`;
        }

        setHeaderBarClassName(newHeaderName)
        // Because the taperColour changes as the question stepper
        // is loaded it is a dependency
    }, [taperColour])

    // Older Ios Versions have trouble with overflow-x: hidden
    // which causes the app bar to disappear
    const getOlderSafari = (): boolean => {
        if (typeof navigator !== "undefined") {
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
                navigator.userAgent.match(/AppleWebKit/)) {
                return true;
            }
        }
        return false;
    }




    const renderSecondaryText = (): void | React.Element<"div"> => {
        if (secondaryText) {
            return (
                <div className="secondary"
                    tabIndex="0"
                >
                    {secondaryText}
                </div>
            )
        }
    }

    const renderInfoText = (): void | React.Element<"div"> => {
        if (infoText) {
            return (
                <div className="info"
                    tabIndex="0"
                >
                    {infoText}
                </div>
            )
        }
    }


    return (
        <div
            className={`${headerBarClassName}`}
        >
            <AppBar
                transition={!fixedAppBar}
                hideLogoWhenNotABar={hideLogoWhenNotABar}
                breakpoint={hideLogoWhenNotABar ? 100 : 30}
                {...goBack}
            />
            <div className="primary"
                tabIndex="0"
            >
                <h1>{primaryText}</h1>
            </div>
            {renderSecondaryText()}
            {renderInfoText()}
            {children}
        </div>
    )
}

HeaderBar.defaultProps = {
    fixedAppBar: false,
    hideLogoWhenNotABar: false,
}

export default HeaderBar;
