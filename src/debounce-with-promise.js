/* @flow */
import _ from "underscore";

/*
 * Like _.debounce, but returns a promise which resolves
 * to the result of the wrapped function.
 * Does not schedule new invocations while the previous
 * call is still pending.
 */
export default function debounceWithPromise(
    func: Function,
    wait: number,
    immediate: ?boolean,
): Function {
    let callInProgress: ?Promise;
    let pendingCallee = [];

    /* eslint-disable no-use-before-define */
    // If any new callees have been scheduled, start again.
    function reschedule() {
        if (pendingCallee.length) {
            debounced();
        }
    }

    const debounced = _.debounce(function() {
        if (callInProgress) {
            // Nothing to do; it'll reschedule itself.
            return;
        }
        let myCallees = pendingCallee;

        pendingCallee = [];

        function resolveCallees(result) {
            for (const row of result) {
                myCallees.shift().resolve(row);
            }

            reschedule();
        }

        function rejectCallees(error) {
            for (let {reject} of myCallees) {
                reject(error);
            }

            reschedule();
        }

        func.apply(this, [myCallees.map((callee) => callee.args)])
            .then(resolveCallees)
            .catch(rejectCallees);

    }, wait, immediate);

    return function(...args) {
        const promise = new Promise((resolve, reject) => {
            pendingCallee.push({resolve, reject, args})
        });

        debounced.apply(this, []);
        return promise
    }
}

export function decorateDebounceWithPromise(
    wait: number,
    immediate: ?boolean,
): Function {
    return function decorated(
        subject: Object,
        propName: string,
        descriptor: Object,
    ) {
        descriptor.value = debounceWithPromise(
            descriptor.value,
            wait,
            immediate,
        );
        return descriptor;
    }
}
