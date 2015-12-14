/* @flow */

import storage from "./storage/index";
export default storage;

if (typeof window != "undefined") {
    window.IzzyStorage = storage
}
