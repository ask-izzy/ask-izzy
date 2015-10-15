/* @flow */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

export default function noop(): (() => void) {
    return () => undefined;
}
