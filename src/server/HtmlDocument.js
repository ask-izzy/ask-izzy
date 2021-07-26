/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import PropTypes from "proptypes";

class HtmlDocument extends React.Component<Object, void> {
    static propTypes = {
        css: PropTypes.arrayOf(PropTypes.string),
        markup: PropTypes.string.isRequired,
        script: PropTypes.arrayOf(PropTypes.string),
        helmet: PropTypes.object,
        // meta tags, title, etc.
        currentUrl: PropTypes.object,
        description: PropTypes.string,
        ogTitle: PropTypes.string,
        ogDescription: PropTypes.string,
        siteName: PropTypes.string,
        envPath: PropTypes.string,
    };

    static defaultProps: any = {
        script: [],
        css: [],
        meta: {},
        envPath: "/static/env.js",
        requestInterceptorPath: "/static/scripts/request-interceptor.js",
    };

    render(): ReactElement<"html"> {
        const {
            markup,
            script,
            css,
            description,
            siteName,
            envPath,
            requestInterceptorPath,
            helmet,
            ogTitle,
            ogDescription,
        } = this.props;
        const viewport =
            "width=device-width, initial-scale=1.0, user-scalable=no";

        return (
            <html lang="en">
                <head>
                    {this.renderRemoteReactDevtoolsScript()}
                    <meta
                        name="viewport"
                        content={viewport}
                    />

                    <meta
                        name="description"
                        content={description}
                    />
                    <meta
                        property="og:type"
                        content="website"
                    />
                    <meta
                        property="og:site_name"
                        content={siteName}
                    />
                    <meta
                        property="og:title"
                        content={ogTitle}
                    />
                    <meta
                        property="og:description"
                        content={ogDescription}
                    />
                    <meta
                        property="og:image"
                        content="https://askizzy.org.au/static/images/askizzy-metatag.jpg"
                    />

                    {helmet.meta.toComponent()}
                    {helmet.link.toComponent()}
                    {helmet.title.toComponent()}

                    {css.map((href, idx) =>
                        <link
                            key={idx}
                            rel="stylesheet"
                            type="text/css"
                            href={href}
                        />)
                    }

                    <link
                        rel="apple-touch-icon"
                        sizes="57x57"
                        href="/static/favicons/apple-touch-icon-57x57.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="60x60"
                        href="/static/favicons/apple-touch-icon-60x60.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="72x72"
                        href="/static/favicons/apple-touch-icon-72x72.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="76x76"
                        href="/static/favicons/apple-touch-icon-76x76.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="114x114"
                        href="/static/favicons/apple-touch-icon-114x114.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="120x120"
                        href="/static/favicons/apple-touch-icon-120x120.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="144x144"
                        href="/static/favicons/apple-touch-icon-144x144.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="152x152"
                        href="/static/favicons/apple-touch-icon-152x152.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/static/favicons/apple-touch-icon-180x180.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="114x114"
                        href="/static/favicons/apple-touch-icon-114x114.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="120x120"
                        href="/static/favicons/apple-touch-icon-120x120.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="144x144"
                        href="/static/favicons/apple-touch-icon-144x144.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="152x152"
                        href="/static/favicons/apple-touch-icon-152x152.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/static/favicons/apple-touch-icon-180x180.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/static/favicons/favicon-32x32.png"
                        sizes="32x32"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/static/favicons/favicon-96x96.png"
                        sizes="96x96"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/static/favicons/favicon-16x16.png"
                        sizes="16x16"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/static/favicons/android-chrome-192x192.png"
                        sizes="192x192"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/static/favicons/android-chrome-192x192.png"
                        sizes="192x192"
                    />
                    <link
                        rel="manifest"
                        href="/static/favicons/manifest.json"
                    />
                    <link
                        rel="shortcut icon"
                        href="/static/favicons/favicon.ico"
                    />
                    <meta
                        name="apple-mobile-web-app-capable"
                        content="yes"
                    />
                    <meta
                        name="apple-mobile-web-app-title"
                        content="Ask Izzy"
                    />
                    <meta
                        name="application-name"
                        content="Ask Izzy"
                    />
                    <meta
                        name="msapplication-TileColor"
                        content="#da532c"
                    />
                    <meta
                        name="msapplication-config"
                        content="/static/favicons/browserconfig.xml"
                    />
                    <meta
                        name="theme-color"
                        content="#ffffff"
                    />
                    <meta
                        name="msapplication-TileImage"
                        content="/static/favicons/mstile-144x144.png"
                    />

                    <script src={envPath} />

                    <script src={requestInterceptorPath} />

                </head>

                <body>
                    <div id="secretContainer" />
                    <div
                        id="root"
                        dangerouslySetInnerHTML={{__html: markup}}
                    />

                    {script.map((src, idx) =>
                        <script
                            key={idx}
                            src={src}
                        />
                    )}
                </body>
            </html>
        );
    }

    /*
    * Add standalone react devtools if not in production
    * Useful for debugging React components in an iOS
    * simulator or Safari
    */
    renderRemoteReactDevtoolsScript(): void | ReactElement<"script"> {
        if (
            typeof window === "undefined" ||
            process.env.NODE_ENV === "production" ||
            !process.env.USE_REMOTE_REACT_DEVTOOLS
        ) {
            return
        }
        const scriptBody = `
            document.addEventListener('DOMContentLoaded', () => {
                const scriptElm = document.createElement('script');
                scriptElm.setAttribute('src',
                    '//' + location.hostname + ':8097'
                );
                document.body.appendChild( scriptElm );
            })
        `
        return <script dangerouslySetInnerHTML={{__html: scriptBody}}/>

    }
}

export default HtmlDocument;
