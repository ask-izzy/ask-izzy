/* @flow */

import pauseToDebug from "./debug";

function unpromisify(func: (...args: any) => Promise<void>): Function {
    return func;
}

export default unpromisify;
