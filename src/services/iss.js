// Only works on the client due to window.fetch

import config from "../config";

export default function search(query) {
    var query = `/api/v3/search/?q=${query}&format=json`;
    return fetch(config.iss.url + query, {
        mode: "cors",
        credentials: 'include',
        headers: {
            Authorization: "Basic " + config.iss.digest,
        }
    });
}
