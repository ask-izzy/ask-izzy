/* eslint-disable max-len */

import React from "react";
import Head from "next/head"

import HeaderBar from "@/src/components/HeaderBar";
import BrandedFooter from "@/src/components/BrandedFooter";
import Link from "@/src/components/base/Link";

function NotFoundStaticPage() {
    return (
        <div
            className="StaticPage"
        >
            <Head>
                <meta
                    name="robots"
                    content="noindex"
                />
            </Head>
            <HeaderBar
                primaryText="Page not found"
                secondaryText={null}
                fixedAppBar={false}
                bannerName={"drugs-alcohol"}
            />
            <div className="body">
                <p>Sorry, but it looks as though the page you are trying to find does not exist. It might be because you followed an old link, or typed the address incorrectly—but it was most likely our fault for moving something.</p>
                <p>Please contact support at 03 9418 7466 or <Link to={`mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}`}>{process.env.NEXT_PUBLIC_SITE_EMAIL}</Link>, and we&apos;ll try to resolve the problem as soon as we can.</p>
            </div>

            <br/>
            <BrandedFooter/>
        </div>
    )
}

export default NotFoundStaticPage
