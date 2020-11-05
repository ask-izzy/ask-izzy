/* $FlowIgnore */
/*eslint-disable */

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

});
