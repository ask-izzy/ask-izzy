export default function unpromisify(fn) {
    return function promisified(...args) {
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
