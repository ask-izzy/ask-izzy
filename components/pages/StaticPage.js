/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import type {Node as ReactNode} from "React";
import HeaderBar from "@/src/components/HeaderBar";
import BrandedFooter from "@/src/components/BrandedFooter";

type Props = {
  title: string,
  bannerName: string,
  children?: React.Node,
  className?: string,
  bannerPrimary?: string,
  bannerSecondary?: string,
}

function StaticPage({
    title,
    bannerName,
    children = null,
    className = "",
    bannerPrimary,
    bannerSecondary,
}: Props): ReactNode {
    return (
        <div className={`StaticPage ${className || ""}`}>
            <div>
                <HeaderBar
                    className="prominentHeading"
                    primaryText={bannerPrimary || title}
                    secondaryText={bannerSecondary || null}
                    bannerName={bannerName || "hand-and-person-with-heart"}
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
