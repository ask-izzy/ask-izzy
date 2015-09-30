/* @flow */

import pauseToDebug from "./debug";
import timeout from "../../src/timeout";

function unpromisify(func: (...args: any) => Promise<void>): Function {
    function stripArgs(func) {
        return () => func();
    }

    return function promisified(...args) {
        // The last argument is a callback(error, result)
        // but there's no success value, so we just strip
        // all arguments on success.
        var done = args.splice(args.length - 1, 1)[0];
        var errorHandler = function(error) {
            var report = () => done(error);

            console.log("Error", error);

            if (process.env.PAUSE_ON_ERROR) {
                pauseToDebug().then(report).catch(report);
            } else {
                report();
            }
        };

        try {
            // Saucelabs borks itself after 90 seconds.
            timeout(80000, func.apply(this, args))
                .then(stripArgs(done))
                .catch(errorHandler);
        } catch (error) {
            errorHandler(error);
        }
    };
}

export default unpromisify;
