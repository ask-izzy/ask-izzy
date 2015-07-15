
import React, { PropTypes } from "react";

import { trackingId } from "../config";
import { provideContext, connectToStores } from "fluxible-addons-react";
import mui from "material-ui";
var ThemeManager = new mui.Styles.ThemeManager();

@provideContext({
    muiTheme: ThemeManager.getCurrentTheme(),
})
@connectToStores([], (context) => {
    const htmlHeadStore = context.getStore("HtmlHeadStore");
    return {
        title: htmlHeadStore.getTitle(),
        description: htmlHeadStore.getDescription(),
        siteName: htmlHeadStore.getSiteName(),
        currentUrl: htmlHeadStore.getCurrentUrl(),
        images: htmlHeadStore.getImages(),
    };
})
class HtmlDocument extends React.Component {

    static propTypes = {
        context: PropTypes.object.isRequired,
        state: PropTypes.string.isRequired,
        markup: PropTypes.string.isRequired,
        script: PropTypes.arrayOf(PropTypes.string),
        css: PropTypes.arrayOf(PropTypes.string),

        // meta tags, title, etc.
        title: PropTypes.string,
        description: PropTypes.string,
        siteName: PropTypes.string,
        currentUrl: PropTypes.string,
        images: PropTypes.array,
    }

    static defaultProps = {
        script: [],
        css: [],
        meta: {},
    }

    render() {
        const { state, markup, script, css, lang } = this.props;
        const {
            title,
            description,
            siteName,
            currentUrl,
            images
        } = this.props;
        const vp = "width=device-width, initial-scale=1.0, user-scalable=no";
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

                <link
                    href='http://fonts.googleapis.com/css?family=Roboto'
                    rel='stylesheet'
                    type='text/css'
                />

                { images.map(url =>
                    <meta property="og:image" content={ url } />
                ) }

                { css.map((href, k) =>
                    <link
                        key={k}
                        rel="stylesheet"
                        type="text/css"
                        href={href}
                    />)
                }

            </head>

            <body>
              <div id="root" dangerouslySetInnerHTML={{__html: markup}} />

              <script dangerouslySetInnerHTML={{__html: state}} />

              { script.map((src, k) => <script key={k} src={src} />) }

            </body>
        </html>
        );
    }
}

export default HtmlDocument;
