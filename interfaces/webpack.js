/* @flow */

declare class webpackJson {
    script: Array<string>;
    css: Array<string>;
    assetsByChunkName: {
        runtime: Array<string>,
        vendor: Array<string>,
        hotload: Array<string>,
        testharness: Array<string>,
        main: Array<string>,
    };
    warnings: Array<string>;
    errors: Array<string>;
}
declare class webpackStats {
    toJson(): webpackJson;
}
