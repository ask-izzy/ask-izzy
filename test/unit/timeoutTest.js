/* @flow */

import assert from "assert";
import Timeout from "../../src/timeout";

describe("timeout", () => {

    function alwaysSucceeds(result: any) {
        return new Promise((resolve) => {
            resolve(result)
            undefined
        });
    }

    function blocksForever() {
        return new Promise(() => undefined);
    }

    describe("when the operation times out", () => {
        it("rejects the promise", async function(): Promise<void> {
            try {
                await Timeout(50, blocksForever());
                assert(false, "Should have timed out");
            } catch (error) {
                assert.equal("Timed out after 50ms", error.message);
            }
        });
    });

    describe("when the operation does not time out", () => {
        it("resolves the promise", async function(): Promise<void> {
            assert.equal(
                "foo",
                await Timeout(50, alwaysSucceeds("foo")),
            );
        });
    });

});
