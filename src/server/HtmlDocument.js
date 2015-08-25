/* @flow */

"use strict";

import React from "react";

class HtmlDocument extends React.Component {

    // flow:disable not supported yet
    static propTypes = {
        markup: React.PropTypes.string.isRequired,
        script: React.PropTypes.arrayOf(React.PropTypes.string),
        css: React.PropTypes.arrayOf(React.PropTypes.string),

        // meta tags, title, etc.
        title: React.PropTypes.string,
        description: React.PropTypes.string,
        siteName: React.PropTypes.string,
        currentUrl: React.PropTypes.string,
    };

    // flow:disable not supported yet
    static defaultProps = {
        script: [],
        css: [],
        meta: {},
    };

    render(): React.Element {
        var { state, markup, script, css, lang } = this.props;
        var {
            title,
            description,
            siteName,
            currentUrl,
            images
        } = this.props;
        var vp = "width=device-width, initial-scale=1.0, user-scalable=no";
        var issconfig = 'var ISS_URL = "' + process.env.ISS_URL + '";';
        var GOOGLE_KEY = process.env.GOOGLE_KEY;

        return (
<html >
    <head>
        <meta
            name="viewport"
            content={ vp }
        />

        <title>{ title }</title>

        <meta
            name="description"
            content={ description }
        />
        <meta
            property="og:type"
            content="website"
        />
        <meta
            property="og:site_name"
            content={ siteName }
        />
        <meta
            property="og:title"
            content={ title }
        />
        <meta
            property="og:description"
            content={ description }
        />
        <meta
            property="og:url"
            content={ currentUrl }
        />

        { css.map((href, k) =>
            <link
                key={k}
                rel="stylesheet"
                type="text/css"
                href={href}
            />)
        }

        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <link rel="stylesheet"
            type="text/css"
            href="//cloud.typography.com/7948374/730248/css/fonts.css"
        />

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
            rel="icon"
            type="image/png"
            href="/static/favicons/favicon-32x32.png" sizes="32x32"
        />
        <link
            rel="icon"
            type="image/png"
            href="/static/favicons/favicon-96x96.png" sizes="96x96"
        />
        <link
            rel="icon"
            type="image/png"
            href="/static/favicons/favicon-16x16.png" sizes="16x16"
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

    </head>

    <body>
      <div id="root" dangerouslySetInnerHTML={{__html: markup}} />
      <script dangerouslySetInnerHTML={{__html: issconfig}} />
      { script.map((src, k) => <script key={k} src={src} />) }

      <script
        /* jscs:disable */
        src={`//maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`}>
      </script>


    </body>
</html>
        );
    }
}

export default HtmlDocument;
