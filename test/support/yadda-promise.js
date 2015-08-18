export default function unpromisify(fn) {
    return function promisified(...args) {
        // The last argument is a callback(error, result)
        // but there's no success value, so we just strip
        // all arguments on success.
        var done = args.splice(args.length - 1, 1)[0];
        try {
            fn.apply(this, args).then(stripArgs(done)).catch(done);
        } catch (e) {
            done(e);
        }
    };

    function stripArgs(fn) {
        return () => fn();
    }

}
