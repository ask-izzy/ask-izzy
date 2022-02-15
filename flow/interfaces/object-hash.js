/* @flow */
/**
 * Taken from: https://github.com/flow-typed/flow-typed/blob/master/definitions/npm/object-hash_v1.x.x/flow_v0.104.x-/object-hash_v1.x.x.js
 */

declare module "object-hash" {
  declare type Options = {|
    algorithm?: "sha1" | "sha256" | "md5" | "passthrough",
    excludeValues?: boolean,
    encoding?: "buffer" | "hex" | "binary" | "base64",
    ignoreUnknown?: boolean,
    unorderedArrays?: boolean,
    unorderedSets?: boolean,
    unorderedObjects?: boolean,
    excludeKeys?: string => boolean
  |};

  declare export default (
    value: { +[string]: mixed, ... } | Array<mixed>,
    options?: Options
  ) => string;
}
