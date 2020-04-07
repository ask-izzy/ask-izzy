/* flow:disable */
/*eslint-disable */
document.addEventListener("DOMContentLoaded", function(event) {
    window.GOOGLE_ANALYTICS_ID = "UA-69572418-4";
    window.GOOGLE_TAG_MANAGER_ID = "GTM-5XC34R";
    window.GOOGLE_TAG_MANAGER_AUTH = "wmCrMTTnSkvyo9kHQjRmLw";
    window.GOOGLE_TAG_MANAGER_ENV = "env-34";

    if (window.GOOGLE_ANALYTICS_ID) {
        // Analytics
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script',`/static/analytics-${window.VERSION}.js`,'ga');
        ga('create', window.GOOGLE_ANALYTICS_ID, 'auto');
        ga('set', 'anonymizeIp', true);  // Anonymize IP addresses of all users.

        // For all trackers, override the sendHitTask to send the analytics
        // payload to our proxy.
        ga(function() {
            var trackers = ga.getAll();
            trackers.forEach(function(tracker) {
                tracker.set('sendHitTask', function(model) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'https://' + window.PROXY_ANALYTICS + '/collect', true);
                    xhr.send(model.get('hitPayload'));
                });
            });
        });

        ga('send', 'pageview');
    }

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
