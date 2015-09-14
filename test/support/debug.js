/* @flow */

function pauseToDebug(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log("Paused. Press any key to continue...");
        var stdin = process.stdin;

        stdin.setRawMode(true);
        stdin.on('data', (key) => {
            stdin.setRawMode(false);
            if (key === '\u0003') {  // Ctrl-C
                reject();
            } else {
                resolve();
            }
        });
    });
}

export default pauseToDebug;
