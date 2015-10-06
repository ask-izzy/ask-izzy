/* @flow */
import { pad } from "underscore.string";

/* flow:disable https://github.com/facebook/flow/issues/846 */
export var Abn = SequenceCb(function Abn(idx: number): string {
    return pad(idx.toString(), 8, '0');
});

/* flow:disable https://github.com/facebook/flow/issues/846 */
export var PhoneNumber = SequenceCb(
    function PhoneNumber(idx: number): string {
        return pad(idx.toString(), 8, '0');
    }
);

/* flow:disable https://github.com/facebook/flow/issues/846 */
export var Email = SequenceCb(function Email(idx: number): string {
    return `email${idx}@dhs.gov.vic.au`;
});

/* flow:disable https://github.com/facebook/flow/issues/846 */
export var Id = SequenceCb(function Id(idx: number): string {
    return idx.toString();
});

/* flow:disable https://github.com/facebook/flow/issues/846 */
export var Url = SequenceCb(function Url(idx: number): string {
    return `https://${idx}.example.org`;
});

export function SequenceCb<U>(cb: (x: number) => U): () => U {
    // No depending on sequences in tests
    // Base number chosen to avoid collisions with existing fixtures.
    var idx = 8100100 + Math.ceil(Math.random() * 500);
    return function() {
        idx = idx + 1;
        return cb(idx);
    };
}

export function Sequence(): () => number {
    return SequenceCb(function(idx: number): number {
        return idx;
    });
}

export function Merge(defaults: Object, props: ?Object): Object {

    // Only allow overriding keys on objects if the sample object is empty.
    if (props && Object.keys(defaults).length) {
        for (var key of Object.keys(props)) {
            if (defaults[key] === undefined) {
                throw new Error(`Supplied unsupported key ${key}`)
            }
        }
    }

    for (var key of Object.keys(defaults)) {
        if (props && props[key] != undefined) {
            if ((typeof defaults[key] == "object") && !Array.isArray(defaults[key])) {
                try {
                    defaults[key] = Merge(defaults[key], props[key]);
                } catch (e) {
                    throw new Error(`Error processing '${key}: ${e.message}.`)
                }
            } else {
                defaults[key] = props[key];
            }
        }
    }

    return defaults;
}
