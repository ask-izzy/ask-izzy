import React, {ReactNode} from "react";
import HeaderBar from "@/src/components/HeaderBar.js";
import BrandedFooter from "@/src/components/BrandedFooter.js";


type Props = {
  title: string,
  bannerName: string,
  children?: ReactNode,
  className?: string,
  bannerPrimary?: string,
  bannerSecondary?: string,
}

function StaticPage({
    title,
    bannerName,
    children,
    className = "",
    bannerPrimary,
    bannerSecondary,
}: Props) {
    return (
        <div className={`StaticPage ${className || ""}`}>
            <div>
                <HeaderBar
                    className="prominentHeading"
                    primaryText={bannerPrimary || title}
                    secondaryText={bannerSecondary || null}
                    bannerName={bannerName || "homepage"}
                />
            </div>
            <main>
                <div className="body">
                    {children}
                </div>
                <br />
            </main>
            <BrandedFooter />
        </div>
    )
}

export default StaticPage
