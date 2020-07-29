/* $FlowIgnore */
/*eslint-disable */
import 'url-search-params-polyfill';

document.addEventListener("DOMContentLoaded", function(event) {
    if (window.GOOGLE_TAG_MANAGER_ID && window.GOOGLE_TAG_MANAGER_AUTH && window.GOOGLE_TAG_MANAGER_ENV) {
        const urlParams = new URLSearchParams(window.location.search);
        const gtmIsDebug = !!urlParams.get('gtm_debug');

        // Tag manager
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//' + window.PROXY_TAGS + '/gtm.js?id='+i+dl+(gtmIsDebug?'&gtm_debug=x':'')+'&gtm_auth='+
        window.GOOGLE_TAG_MANAGER_AUTH+'&gtm_preview='+window.GOOGLE_TAG_MANAGER_ENV;
        f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',window.GOOGLE_TAG_MANAGER_ID);
    }

});
