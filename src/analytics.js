/* $FlowIgnore */
/*eslint-disable */
import 'url-search-params-polyfill';

document.addEventListener("DOMContentLoaded", function(event) {

    window.onUsersnapCXLoad = function(api) {
        api.init({
            button: {isHidden: true}
        });
        window.Usersnap = api;
    }
    var script = document.createElement('script');
    script.defer = 1;
    script.src = 'https://widget.usersnap.com/global/load/e8e15b8e-a779-4356-85dd-7fcbb37bf738?onload=onUsersnapCXLoad';
    document.getElementsByTagName('head')[0].appendChild(script);

    if (window.GOOGLE_TAG_MANAGER_ID && window.GOOGLE_TAG_MANAGER_AUTH && window.GOOGLE_TAG_MANAGER_ENV) {
        for (const index of window.GOOGLE_TAG_MANAGER_ID.split("~").keys()) {
            const gtmId = window.GOOGLE_TAG_MANAGER_ID.split("~")[index];
            const gtmAuth = window.GOOGLE_TAG_MANAGER_AUTH.split("~")[index];
            const gtmEnv = window.GOOGLE_TAG_MANAGER_ENV.split("~")[index];
            const urlParams = new URLSearchParams(window.location.search);
            const gtmIsDebug = !!urlParams.get('gtm_debug');
            const dataLayerKey = `dataLayer${gtmId.split('-')[1]}`;

            // Tag manager
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '//' + window.PROXY_TAGS + '/gtm.js?id='+i+dl+(gtmIsDebug?'&gtm_debug=x':'')+'&gtm_auth='+
            gtmAuth+'&gtm_preview='+gtmEnv;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script',dataLayerKey,gtmId);
        }
    }

});
