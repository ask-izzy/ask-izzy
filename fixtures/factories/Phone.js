/* @flow */

import { PhoneNumber, Merge } from "./Value";

export function Phone(props: ?Object): phone {
    return Merge({
        kind: "phone",
        number: PhoneNumber(),
        comment: "",
    }, props);
}
