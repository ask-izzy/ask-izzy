/* flow:disable */
/* This function intercepts xmlhttprequests and checks if
* the request is being made to an external domain.
* For the purpose of AskIzzy to be zero-rated for end users,
* known external services are proxied through Infoxchange servers.
*/
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

        // Replace external domain
        let newUrl = replaceDomain(url);

        open.call(this, method, newUrl, async, user, pass);

        // Function: Replace knwon external domains to internal proxy
        function replaceDomain(pUrl) {
            // Parse hostname from URL
            let parser = document.createElement('a');

            parser.href = pUrl;

            // Map domain name to replace
            let map = {
                "www.google-analytics.com":
                    "www.google-analytics.askizzy.org.au",
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
    };
})(XMLHttpRequest.prototype.open);
