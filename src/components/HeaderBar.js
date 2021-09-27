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
        // We'll be going as far back as version 10
        // because as of 2021 the currently supported version is 12
        // and it's very unlikely someone is still using a version before 10
        // eslint-disable-next-line max-len
        const safariVersions = /(Version\/10|Version\/11|Version\/12|Version\/13|Version\/14)/
        if (typeof navigator !== "undefined") {
            if (
                navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
                // some versions of safari on desktop also have this issue
                // which is why we need to check for specific versions
                // Also some mobile versions will not indicate that it is an
                // iPad or iPhone
                navigator.userAgent.match(safariVersions)
            ) {
                return true;
            }
        }
        return false;
    }


    const renderSecondaryText = (): void | React.Element<"div"> => {
        if (secondaryText) {
            return (
                <div className="secondary">
                    <h2 className={infoText ? "bold" : undefined}>
                        {secondaryText}</h2>
                </div>
            )
        }
    }

    const renderInfoText = (): void | React.Element<"div"> => {
        if (infoText) {
            return (
                <div className="info">
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
            <div className="primary">
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
