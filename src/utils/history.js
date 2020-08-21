/* flow:disable */
import { createBrowserHistory, createMemoryHistory } from "history";
import storage from "../storage";

let history;

if (typeof document !== "undefined") {
    history = createBrowserHistory()
} else {
    history = createMemoryHistory()
}

export const onBack = () => {
    let historyLength = storage.getHistoryLength();

    if (historyLength > 0) {
        history.back();
    } else {
        history.push("/")
    }
}

export default history;