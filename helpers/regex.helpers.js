/* @flow */
// Some modern browsers still don't support lookbehinds (looking at you safari :/),
// so this function can be used for detecting support and thus enabling the use of a
// fallback.
//
// IMPORTANT NOTE! Browsers that don't support lookbehinds will bork if they see a
// regex literal with one in it even if it is never executed. So make sure you either
// create that regex from a string or warp it in a try statement.
export function lookbehindIsSupported(): boolean {
    try {
        return !!(
        "text-test1-behind-test2-test3"
            .match(
                new RegExp("(?<=behind)-test\\d", "g")
            )?.[0] === "-test2" &&
        "behind-test1-test2"
            .match(
                new RegExp("(?<!behind)-test\\d", "g")
            )?.[0] === "-test2"
        );
    } catch (error) {
        return false;
    }
}

export function PhoneHref(number: string): string {
    return "tel:" + number.replace(/[^0-9+]/g, "")
}
