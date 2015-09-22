import { PhoneNumber, Merge } from "./Value";

export function Phone(props: ?Object) {
    return Merge({
        kind: "phone",
        number: PhoneNumber(),
        comment: "",
    }, props);
}
