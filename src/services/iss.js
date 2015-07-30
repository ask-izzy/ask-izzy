// Only works on the client due to window.fetch

import config from "../config";

export default function search(query) {
    var query = `/api/v3/search/?q=${query}&format=json`;
    console.log(config.issUrl);
    return fetch(config.issUrl + query);
}
