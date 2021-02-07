/* $FlowIgnore */

function pauseToDebug() {
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

export default pauseToDebug;
