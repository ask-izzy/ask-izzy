/* @flow */
import OnlineSafetyScreen from "./OnlineSafetyScreen";

export default function<T>(initialQuestion: T): Array<T> {
    return [
        initialQuestion,
        OnlineSafetyScreen,
    ]
}
