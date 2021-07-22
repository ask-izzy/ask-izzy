/* @flow */

import {useEffect, useState} from "react";

export function windowWidth(): any | number {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
}

