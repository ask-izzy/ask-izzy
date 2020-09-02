/* $FlowIgnore */
require("whatwg-fetch");
require("core-js");
require("regenerator-runtime/runtime");
// babel-polyfill isn't impotent https://github.com/babel/babel/issues/4019 and
// the extra script we inject during testing also uses it.
if (!window._babelPolyfill) {
    require("babel-polyfill");
}

require("./styles/bundle.scss");
require("./client");
