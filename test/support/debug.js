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
                if (key === "\u0003") {
                    // Ctrl-C
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
        if (test.parent?.title) {
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

export async function showCursorPosition(driver) {
    // based off https://stackoverflow.com/a/67180588
    await driver.executeScript(() => {
        const styleElm = document.createElement("style")
        styleElm.appendChild(
            document.createTextNode(`
                .dot {
                    top: 0;
                    left: 0;
                    background: red;
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    z-index: 10000;
                    border-radius: 50%;
                }
            `)
        )
        document.body.appendChild(styleElm)

        const dotElm = document.createElement("div");
        dotElm.className = "dot";
        document.body.appendChild(dotElm);

        document.onmousemove = handleMouseMove;
        // eslint-disable-next-line complexity
        function handleMouseMove(event) {
            let eventDoc, doc, body;

            // If pageX/Y aren't available and clientX/Y
            // are, calculate pageX/Y - logic taken from jQuery
            // Calculate pageX/Y if missing and clientX/Y available
            if (event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) ||
                    document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // Update dot to mouse cursor pos
            dotElm.style.left = event.pageX + "px";
            dotElm.style.top = event.pageY + "px";
        }
    });
}

export default pauseToDebug;
