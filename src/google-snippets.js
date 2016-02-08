/* @flow */
/* eslint-disable max-len */

function script(content: ?string, src: ?string): void {
    let elem = document.createElement("script");

    if (src) {
        elem.setAttribute("src", src);
    }

    if (content) {
        elem.innerHTML = content;
    }

    document.body.appendChild(elem);
}

export default function snippets(): void {
    if (typeof window != "undefined" &&
        typeof document != "undefined") {
        // Google maps
        script(
            "",
            "//maps.googleapis.com/maps/api/js?key=" +
            window.GOOGLE_API_KEY +
            "&libraries=places"
        );

        // Analytics
        script(`
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
            ga('create', window.GOOGLE_ANALYTICS_ID, 'auto');
            ga('send', 'pageview');
        `);

        // Tag manager
        script(`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', window.GOOGLE_TAG_MANAGER_ID);
        `);
    }
}
