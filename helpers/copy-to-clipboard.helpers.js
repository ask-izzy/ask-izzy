/* @flow */

export async function CopyToClipboard(text: string) {
    if ("clipboard" in navigator) {
        navigator.clipboard.writeText(text);
    } else {
        // navigator.clipboard only supports modern browsers
        // the following uses the deprecated document.execCommand("copy")
        // that requires this hack
        // https://stackoverflow.com/questions/47879184/document-execcommandcopy-not-working-on-chrome
        let textarea = document.createElement("textarea");
        textarea.textContent = text
        document.body?.appendChild(textarea);

        let selection = document.getSelection();
        let range = document.createRange();
        range.selectNode(textarea);
        selection?.removeAllRanges();
        selection?.addRange(range);

        document.execCommand("copy")
        selection?.removeAllRanges();
        document.body?.removeChild(textarea);
    }
}