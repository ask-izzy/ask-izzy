/* @flow */

import pauseToDebug from "./debug";

function unpromisify(func: (...args: any) => Promise<void>): Function {
    function stripArgs(func) {
        return () => func();
    }

    return function promisified(...args) {
        // The last argument is a callback(error, result)
        // but there's no success value, so we just strip
        // all arguments on success.
        const done = args.splice(args.length - 1, 1)[0];
        const errorHandler = function(error) {
            const report = () => done(error);

            console.log("Error", error, error.stack);

            if (process.env.PAUSE_ON_ERROR) {
                pauseToDebug().then(report).catch(report);
            } else {
                report();
            }
        };

        try {
            func.apply(this, args)
                .then(stripArgs(done))
                .catch(errorHandler);
        } catch (error) {
            errorHandler(error);
        }
    };
}

export default unpromisify;
