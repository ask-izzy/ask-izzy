/* @flow */

import pauseToDebug from "./debug";
import _ from "underscore";

// This was originally needed because yadda only used
// callbacks. Now that callback support has been added,
// we still need it, to implement e.g. pause on error.
function unpromisify(func: (...args: any) => Promise<void>): Function {
    function stripArgs(func) {
        return () => func();
    }

    return function promisified(...args) {
        // The last argument is a callback(error, result)
        // but there's no success value, so we just strip
        // all arguments on success.
        const done = _.once(_(arguments).last());

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

        return undefined;
    };
}

export default unpromisify;
