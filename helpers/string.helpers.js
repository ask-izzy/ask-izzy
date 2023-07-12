/* @flow */

export function shortenText(maxCharacters: number, text: string): string {
    if (text.length <= maxCharacters) {
        return text;
    }
    let shortened = text.slice(0, maxCharacters);

    if (text[maxCharacters] !== " " && shortened.lastIndexOf(" ") !== -1) {
        shortened = shortened.slice(0, shortened.lastIndexOf(" "));
    }

    if (shortened[shortened.length - 1] === ".") {
        return shortened;
    } else {
        return shortened + " ...";
    }
}