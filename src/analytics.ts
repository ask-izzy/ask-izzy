/* eslint-disable */
import "core-js/actual/url-search-params";

if (typeof document !== "undefined" && process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_AUTH && process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENV) {
    document.addEventListener("DOMContentLoaded", function(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const gtmIsDebug = !!urlParams.get('gtm_debug');

        // Tag manager
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';(j as any).async=true;(j as any).src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl+(gtmIsDebug?'':'&gtm_auth='+
        process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_AUTH+'&gtm_preview='+process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENV+'&gtm_cookies_win=x');
        f.parentNode?.insertBefore(j,f);
        })(window,document,'script','dataLayer',process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID);
    });
}
