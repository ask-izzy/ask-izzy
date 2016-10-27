/* flow:disable */
/* The functions below intercepts xmlhttprequests and js loaded via scripts
* and checks if the requests are being made to an external domain.
* For the purpose of AskIzzy to be zero-rated for end users,
* all known external services are proxied through Infoxchange servers.
*/

var zeroRatingHelper = new Object();

// Common replace function: Replace knwon external domains to internal proxy
// Domain lists are generated from generate-env-vars
zeroRatingHelper.replaceDomain = function(url) {
    // Parse hostname from URL
    let parser = document.createElement('a');

    parser.href = url;

    if (parser.hostname in window.DOMAIN_MAPS) {
        parser.hostname = window.DOMAIN_MAPS[parser.hostname];
        return parser.href;
    } else if (window.EXCLUDED_DOMAINS.indexOf(parser.hostname) !== -1){
        return 'null';
    } else {
        return url;
    }
};

zeroRatingHelper.replaceDomainInString = function(str){
    let result = str;
    for(domain in window.DOMAIN_MAPS){
        result = zeroRatingHelper.replaceAll(result, domain, window.DOMAIN_MAPS[domain]);
        //result = result.replace(domain, window.DOMAIN_MAPS[domain]);
    }
    for(i in window.EXCLUDED_DOMAINS){
        if ( result.indexOf(window.EXCLUDED_DOMAINS[i]) !== -1 ){
            result = zeroRatingHelper.replaceAll(result, domain, 'null');
            //result = result.replace(domain, 'null');
        }
    }
    return result;
};

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

zeroRatingHelper.retrieveGoogleMapsAPIJS = function(){
    let googlemaps_url = '/maps/api/js?v=3.25&key=' + window.GOOGLE_API_KEY + '&libraries=places';
    let googlemaps_url_dev = 'https://maps.googleapis.com/maps/api/js?v=3.25&key=' + window.GOOGLE_API_KEY + '&libraries=places';

    // Load xhr script
    onSuccess = function(responseText){
        res = zeroRatingHelper.replaceDomainInString(responseText);
        let gScript = document.createElement("script");
        let gScriptText = document.createTextNode(res);
        gScript.appendChild(gScriptText);
        document.getElementsByTagName('head')[0].appendChild(gScript);
    };

    // If this is dev, load original script via script tag, zero rating not required
    onFail = function(status){
        if (location.host.indexOf('localhost') !== -1 ){
            let gScript = document.createElement("script");
            gScript.src = googlemaps_url_dev;
            document.getElementsByTagName('head')[0].appendChild(gScript);
        }
    }

    zeroRatingHelper.getResource(googlemaps_url, onSuccess, onFail);
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
// the browser attempts to load using this method
document.createElement = function(create) {
    return function() {
        var ret = create.apply(this, arguments);
        if (ret.tagName.toLowerCase() === "script" ||
            ret.tagName.toLowerCase() === "img")
        {
            // Copy original src/etc setter to a new property
            if ( ret.tagName.toLowerCase() === "script" ){
                Object.defineProperty(ret, 'originalSrc',
                    Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src")
                );
             } else if (ret.tagName.toLowerCase() === "img" ) {
                Object.defineProperty(ret, 'originalSrc',
                    Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")
                );
             }

            if (ret.tagName.toLowerCase() === "script" ||
            ret.tagName.toLowerCase() === "img" ){
                // Override the src property. Add replaceDomain to the setter.
                Object.defineProperty(ret, "src", {
                    get : function () {
                        return this.originalSrc;
                    },
                    set : function (val) {
                        let newSrc = zeroRatingHelper.replaceDomain(val);
                        this.originalSrc = newSrc;
                    }
                });
            }
        }
        return ret;
    };
}(document.createElement)

// Retrieve google maps api file
zeroRatingHelper.retrieveGoogleMapsAPIJS();
