/* eslint-disable prefer-arrow-callback */

import { pad } from "underscore.string";

export function SequenceCb<U>(callback: (x: number) => U): () => U {
    // No depending on sequences in tests
    // Base number chosen to avoid collisions with existing fixtures.
    let idx = 8100100 + Math.ceil(Math.random() * 500);

    return function(): U {
        idx += 1;
        return callback(idx);
    };
}

export const Abn: () => string = SequenceCb(
    function Abn(idx: number): string {
        return pad(idx.toString(), 8, "0");
    },
);

export const PhoneNumber: () => string = SequenceCb(
    function PhoneNumber(idx: number): string {
        return pad(idx.toString(), 8, "0");
    },
);

export const Email: () => string = SequenceCb(
    function Email(idx: number): string {
        return `email${idx}@dhs.gov.vic.au`;
    },
);

export const Id: () => string = SequenceCb(function Id(idx: number): string {
    return idx.toString();
});

export const Url: () => string = SequenceCb(
    function Url(idx: number): string {
        return `https://${idx}.example.org`;
    },
);

export function Sequence(): () => number {
    return SequenceCb(function(idx: number): number {
        return idx;
    });
}
