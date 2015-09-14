/* @flow */

"use strict";

import pauseToDebug from './debug';

function unpromisify(fn: (...args: any) => Promise<void>): Function {
    function stripArgs(fn) {
        return () => fn();
    }

    return function promisified(...args) {
        // The last argument is a callback(error, result)
        // but there's no success value, so we just strip
        // all arguments on success.
        var done = args.splice(args.length - 1, 1)[0];
        var errorHandler = function(e) {
            var report = () => done(e);
            console.log("Error", e);
            if (process.env.PAUSE_ON_ERROR) {
                pauseToDebug().then(report).catch(report);
            } else {
                report();
            }
        };

        try {
            fn.apply(this, args)
                .then(stripArgs(done))
                .catch(errorHandler);
        } catch (e) {
            errorHandler(e);
        }
    };
}

export default unpromisify;
