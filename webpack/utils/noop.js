/* @flow */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

"use strict";
export default function noop(): (() => void) {
    return () => undefined;
}
