/* flow:disable */
import { createBrowserHistory, createMemoryHistory } from "history";

let history;

if (typeof document !== "undefined") {
    history = createBrowserHistory()
}
else {
    history = createMemoryHistory()
}

export default history;