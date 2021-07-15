/* $FlowIgnore */

import fs from "fs-extra"
import Path from "path"

function pauseToDebug() {
    this.mochaState.timeout(0)
    this.mochaState.slow(1000 * 60 * 60 * 24)
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;

        if (stdin.setRawMode) {
            console.log("Paused. Press any key to continue...");
            stdin.setRawMode(true);
            stdin.on("data", (key) => {
                stdin.setRawMode(false);
                if (key === "\u0003") { // Ctrl-C
                    reject();
                } else {
                    resolve();
                }
            });
        } else {
            console.log("Cannot capture STDIN; hanging forever.")
        }
    });
}

export async function takeScreenshot(driver, filepath): String {
    let data = await driver.takeScreenshot();

    fs.ensureDir(Path.dirname(filepath))
    await fs.writeFile(filepath, data, "base64");
    return filepath
}

export async function deleteSceenshot(test) {
    await fs.remove(getSceenshotPath(test))
}

export function getSceenshotPath(test) {
    function getFullTitle(test) {
        if (test.parent && test.parent.title) {
            return [test.title, ...getFullTitle(test.parent)]
        } else {
            return [test.title]
        }
    }

    const slug = getFullTitle(test)
        .map(part => part.replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "_"))
        .map(part => part.length > 50 ? part.substring(0, 48) + "…" : part)
        .join(" - ");

    return `testing-screenshots/${slug}.png`
}

export default pauseToDebug;
