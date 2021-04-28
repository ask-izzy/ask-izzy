/* @flow */


import Link from "../components/Link";
import * as React from "react";


type ReactMarkdownLinkProps = {
    href: string,
    children: React.Node
}


export const absoluteImageUrl = (uri: string): string => {
    // Strapi returns a relative image url, we need to change
    // it to point to our content server.
    return window.STRAPI_URL + uri;
}

export const renderLink = (props: ReactMarkdownLinkProps) => {
    return (
        <Link to={props.href}>{props.children}</Link>
    );
}
