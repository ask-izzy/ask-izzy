/* $FlowIgnore */
// The functions below intercepts xmlhttp/fetch/sendBeacon requests + js
// loaded via scripts and checks if the request is being made to an external
// domain. For the purpose of Ask Izzy to be zero-rated for end users,
// all known external services are proxied through Infoxchange servers.

// The code here is ugly because our previous setup meant it wasn't pre-compiled
// so we were limited to only writing js that the lowest browser we supported at
// the time could run. We can now work on cleaning this up.

export default function initialiseRequestInterceptor() {
    const proxyDomains = process.env.DOMAINS_TO_PROXY
    const domainsAllowedWithoutProxy = (process.env.NEXT_PUBLIC_DOMAINS_ALLOWED_WITHOUT_PROXY || "")
        .split(",").map(domain => domain.trim())
    const zeroRatingHelper = new Object();

    // Common replace function: Replace known external domains to internal proxy
    zeroRatingHelper.replaceDomain = function(oldUrlString) {
        if (oldUrlString.toString().startsWith("data:")) {
            return oldUrlString
        }

        let url
        try {
            url = new URL(oldUrlString)
        } catch (error) {
            return oldUrlString
        }

        if (url.host in proxyDomains) {
            let newOrigin = proxyDomains[url.host]

            // Add protocol if there isn't yet one
            if (!newOrigin.match(/^\w+:\/\//)) {
                newOrigin = "https://" + newOrigin
            }

            let newUrl = new URL(url.pathname + url.search, newOrigin)

            if (zeroRatingHelper.debugModeActive()) {
                console.info("URL intercepted and modified\nOld URL: " + url.href + "\nNew URL: " + newUrl.href)
            }
            url = newUrl;
        } else if (url.host !== location.host && !domainsAllowedWithoutProxy.includes(url.host)) {
            console.error(`Accessing an external resource without proxying it: ${url.href}`)
        }

        if (process.env.NEXT_PUBLIC_SERVER_PROXY && url.host !== location.host) {
            url = new URL(
                "/api/external-resource-proxy/" +
                    encodeURIComponent(url.origin) + url.pathname +
                    url.search,
                location.origin
            )
        }

        return url
    };

    zeroRatingHelper.debugModeActive = function() {
        if (typeof window !== "undefined" && window.localStorage) {
            let debugMode = false;
            try {
                debugMode = JSON.parse(
                    window.localStorage.getItem("debug")
                );
            } catch (error) {
                //
            }
            return debugMode
        }
        return false
    }

    zeroRatingHelper.escapeRegExp = function(str) {
        return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    };

    zeroRatingHelper.replaceAll = function(str, find, replace) {
        return str.replace(new RegExp(zeroRatingHelper.escapeRegExp(find), "g"), replace);
    };

    zeroRatingHelper.getResource = function(url, successCallback, failCallback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    successCallback(xhr.responseText);
                } else {
                    failCallback(xhr.status);
                }
            }
        };
        xhr.open("GET", url, false);
        xhr.send(null);
    };

    // 1. Replace domains for all XMLHttpRequests
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            // Replace external domain
            let newUrl = zeroRatingHelper.replaceDomain(url);
            open.call(this, method, newUrl, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    // 2. Replace domains for all scripts loaded via createElement
    // Override the src property so we can replace the domains for new scripts that
    // the browser attempts to load using this method.
    document.createElement = function(create) {
        return function() {
            let ret = create.apply(this, arguments);
            if (ret.tagName.toLowerCase() === "script" ||
                ret.tagName.toLowerCase() === "img") {
                let objProp;
                // Copy original src/etc setter to a new property
                if (ret.tagName.toLowerCase() === "script") {
                    objProp = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
                    Object.defineProperty(ret, "originalSrc", objProp);
                } else if (ret.tagName.toLowerCase() === "img") {
                    objProp = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
                    Object.defineProperty(ret, "originalSrc", objProp);
                }

                if (objProp.configurable) {
                    // Override the src property. Add replaceDomain to the setter.
                    Object.defineProperty(ret, "src", {
                        get: function() {
                            return this.originalSrc;
                        },
                        set: function(val) {
                            let newSrc = zeroRatingHelper.replaceDomain(val.toString());
                            this.originalSrc = newSrc;
                        },
                    });
                }
            }
            return ret;
        };
    }(document.createElement);

    // 3. Replace domains for all fetch requests
    window.fetch && (function(originalFetchFunction) {
        window.fetch = function() {
            if (arguments[0]) {
                arguments[0] = zeroRatingHelper.replaceDomain(arguments[0])
            }
            return originalFetchFunction(...arguments)
        };
    })(window.fetch);

    // 4. Replace domains for all sendBeacon requests
    window.navigator && window.navigator.sendBeacon && (function(originalSendBeaconFunction) {
        window.navigator.sendBeacon = function() {
            if (arguments[0]) {
                arguments[0] = zeroRatingHelper.replaceDomain(arguments[0])
            }
            return originalSendBeaconFunction.apply(window.navigator, arguments)
        };
    })(window.navigator.sendBeacon);
}
