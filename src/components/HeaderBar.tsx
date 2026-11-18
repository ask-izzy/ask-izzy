import * as React from "react";
import { useRouter } from "next/router"
import AppBar from "./AppBar";

type Props = {
    primaryText: string | React.ReactNode,
    secondaryText?: string | React.ReactNode,
    infoText?: string | React.ReactNode,
    children?: React.ReactNode,
    bannerName: string,
    className?: string,
    taperColour?: string,
    fixedAppBar?: boolean,
    hideLogoWhenNotABar?: boolean,
    backUrl?: string,
    backMessage?: string,
}

function HeaderBar({
    bannerName,
    className,
    taperColour,
    primaryText,
    children,
    secondaryText,
    infoText,
    fixedAppBar = false,
    hideLogoWhenNotABar = false,
    backUrl,
    backMessage,
}: Props): React.ReactNode {
    const router = useRouter()

    // At some point we should rewrite appBar not to use js for navigation
    // and instead use links which are better for accessibility.
    const appBarGoBack = backUrl || backMessage ?
        {
            onBackTouchTap: () => router.push(backUrl ?? "/"),
            backMessage: backMessage || "Back",
        }
        : {}


    let headerBarClassName = "HeaderBar showTaper"
    if (bannerName) {
        headerBarClassName += ` banner-${bannerName}`;
    }
    if (className) {
        headerBarClassName += ` ${className}`;
    }
    if (taperColour) {
        headerBarClassName += ` taperColour${taperColour}`;
    }

    const renderSecondaryText = (): React.ReactElement<"div"> | undefined => {
        if (secondaryText) {
            return (
                <div className="secondary">
                    <h2 className={infoText ? "bold" : undefined}>
                        {secondaryText}</h2>
                </div>
            )
        }
    }

    const renderInfoText = (): React.ReactElement<"div"> | undefined => {
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
            className={headerBarClassName}
        >
            <AppBar
                transition={!fixedAppBar}
                hideLogoWhenNotABar={hideLogoWhenNotABar}
                breakpoint={hideLogoWhenNotABar ? 100 : 30}
                {...appBarGoBack}
            />
            <header aria-label="Page header">
                <div className="primary">
                    {/* We use tabIndex here so we can set the user's focus to
                    this on page transition */}
                    <h1 tabIndex={-1}>
                        {primaryText}
                    </h1>
                </div>
                {renderSecondaryText()}
                {renderInfoText()}
                {children}
            </header>
        </div>
    )
}

export default HeaderBar
