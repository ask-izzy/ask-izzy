/* @flow */
import useOnInitialPageRender from "./useOnInitialPageRender";

export default (): void => {
    useOnInitialPageRender(() => {
        document.querySelector("h1")?.focus()
    })
};

