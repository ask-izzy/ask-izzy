/* $FlowIgnore */
// The functions below intercepts xmlhttprequests, js loaded via scripts,
// fetch requests and checks if the requests are being made to an external
// domain. For the purpose of AskIzzy to be zero-rated for end users,
// all known external services are proxied through Infoxchange servers.

var zeroRatingHelper = new Object();

zeroRatingHelper.isPhantomJS = window.navigator.userAgent.search('PhantomJS') != -1;

// Common replace function: Replace known external domains to internal proxy
// Domain lists are generated from generate-env-vars
zeroRatingHelper.replaceDomain = function(oldUrl) {
    let url
    try {
        url = new URL(oldUrl)
    } catch(error) {
        return oldUrl
    }

    if (url.host in window.PROXY_DOMAINS) {
        let newHost = window.PROXY_DOMAINS[url.host]
        // If hostname is just the port then append the hostname of the current page
        if (newHost.match(/^:\d+$/)) {
            newHost = location.hostname + newHost
        }
        url.host = newHost;
        url.protocol = window.PROXY_PROTOCOL || url.protocol

        if (zeroRatingHelper.debugModeActive()) {
            console.info("URL intercepted and modified\nOld URL: " + oldUrl + "\nNew URL: " + url.href)
        }
        return url.href;
    } else if (window.PROXY_EXCLUDED_DOMAINS.indexOf(url.host) !== -1){
        return 'null';
    } else {
        return oldUrl;
    }
};

zeroRatingHelper.debugModeActive = function() {
    if (typeof window !== "undefined" && window.localStorage) {
        var debugMode = false;
        try {
            debugMode = JSON.parse(
                window.localStorage.getItem('debug')
            );
        } catch (error) {

        }
        return debugMode
    }
    return false
}

zeroRatingHelper.escapeRegExp = function(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

zeroRatingHelper.replaceAll = function(str, find, replace) {
  return str.replace(new RegExp(zeroRatingHelper.escapeRegExp(find), 'g'), replace);
};

zeroRatingHelper.getResource = function(url, success_callback, fail_callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if ( xhr.status === 200){
                success_callback(xhr.responseText);
            } else {
                fail_callback(xhr.status);
            }
        }
    };
    xhr.open('GET', url, false);
    xhr.send(null);
};

// 1. Replace domains for all XMLHttpRequests
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

        // Replace external domain
        var newUrl = zeroRatingHelper.replaceDomain(url);
        open.call(this, method, newUrl, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

// 2. Replace domains for all scripts loaded via createElement
// Override the src property so we can replace the domains for new scripts that
// the browser attempts to load using this method.
// Note: phantomJS doesnt like this. Disable until a newer phantomJS version.
if ( !zeroRatingHelper.isPhantomJS ){
    document.createElement = function(create) {
        return function() {
            var ret = create.apply(this, arguments);
            if (ret.tagName.toLowerCase() === "script" ||
                ret.tagName.toLowerCase() === "img")
            {
                var obj_prop;
                // Copy original src/etc setter to a new property
                if ( ret.tagName.toLowerCase() === "script" ){
                    obj_prop = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
                    Object.defineProperty(ret, 'originalSrc', obj_prop);
                } else if (ret.tagName.toLowerCase() === "img" ){
                    obj_prop = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
                    Object.defineProperty(ret, 'originalSrc', obj_prop);
                }

                if ( obj_prop.configurable ){
                    // Override the src property. Add replaceDomain to the setter.
                    Object.defineProperty(ret, "src", {
                        get : function (){
                            return this.originalSrc;
                        },
                        set : function (val){
                            var newSrc = zeroRatingHelper.replaceDomain(val);
                            this.originalSrc = newSrc;
                        }
                    });
                }
            }
            return ret;
        };
    }(document.createElement);
}

// 3. Replace domains for all fetch requests
window.fetch && (function(originalFetchFunction) {
    window.fetch = function() {
        if (arguments[0]) {
            arguments[0] = zeroRatingHelper.replaceDomain(arguments[0])
        }
        return originalFetchFunction.apply(null, arguments)
    };
})(window.fetch);
