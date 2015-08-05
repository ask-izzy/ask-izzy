import config from "../config";

export default function search(query) {
    var query = `/api/v3/search/?q=${query}&format=json`;
    return fetch(config.iss.url + query, {
        mode: "cors",
        headers: {
            Authorization: "Basic " + config.iss.digest,
        }
    });
}
