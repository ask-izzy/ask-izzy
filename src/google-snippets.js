/* @flow */
/* eslint-disable max-len */

function script(content: ?string, src: ?string): void {
    let elem = document.createElement("script");

    if (src) {
        elem.setAttribute("src", src);
    }

    if (content) {
        elem.innerHTML = content;
    }

    document.body.appendChild(elem);
}

export default function snippets(): void {
    if (typeof window != "undefined" &&
        typeof document != "undefined") {
        // Google maps
        script(
            "",
            "//maps.googleapis.com/maps/api/js?key=" +
            window.GOOGLE_API_KEY +
            "&libraries=places"
        );
    }
}
