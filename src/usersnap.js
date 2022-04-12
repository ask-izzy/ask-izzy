/* $FlowIgnore */
/*eslint-disable */

document.addEventListener("DOMContentLoaded", function(event) {
    if (!window.USERSNAP_API_KEY) {
        return
    }

    window.onUsersnapCXLoad = function(api) {
        api.init({
            button: {isHidden: true}
        });
        window.Usersnap = api;
    }
    var script = document.createElement('script');
    script.defer = 1;
    script.src = `https://widget.usersnap.com/global/load/${window.USERSNAP_API_KEY}?onload=onUsersnapCXLoad`;
    document.getElementsByTagName('head')[0].appendChild(script);

});
