/* flow:disable */
/* The functions below intercepts xmlhttprequests and js loaded via scripts
* and checks if the requests are being made to an external domain.
* For the purpose of AskIzzy to be zero-rated for end users,
* all known external services are proxied through Infoxchange servers.
*/

// Common replace function: Replace knwon external domains to internal proxy
function replaceDomain(pUrl) {
    // Parse hostname from URL
    let parser = document.createElement('a');

    parser.href = pUrl;

    // Map domain name to replace
    let map = {
        "www.google-analytics.com":
            "google-analytics.askizzy.org.au",
        "google-analytics.com":
            "google-analytics.askizzy.org.au",
        "bam.nr-data.net":
            "bam-nr-data.askizzy.org.au",
        "js-agent.newrelic.com":
            "js-agent-newrelic.askizzy.org.au",
    };

    if (parser.hostname in map) {
        parser.hostname = map[parser.hostname];
        return parser.href;
    } else {
        return pUrl;
    }
}

// 1. Replace domains for XMLHttpRequests
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

        // Replace external domain
        let newUrl = replaceDomain(url);
        open.call(this, method, newUrl, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

// 2. Replace domains for scripts loaded via createElement
// Override the src property so we can replace the domains for new scripts that
// the browser attempts to load using this method
document.createElement = function(create) {
    return function() {
        var ret = create.apply(this, arguments);
        if (ret.tagName.toLowerCase() === "script") {
            // Copy original src setter to a new property
            Object.defineProperty(ret, 'originalSrc',
                Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src")
            );
            // Override the src property. Add replaceDomain to the setter.
            Object.defineProperty(ret, "src", {
                get : function () {
                    return this.originalSrc;
                },
                set : function (val) {
                    let newSrc = replaceDomain(val);
                    this.originalSrc = newSrc;
                }
            });
        }
        return ret;
    };
}(document.createElement)
