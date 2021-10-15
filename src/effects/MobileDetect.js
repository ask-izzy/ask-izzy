/* @flow */

import {useEffect, useState} from "react";

const MOBILE_BREAKPOINT = 768;

export function MobileDetect(breakpointOverride: ?number): boolean {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth || 200);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width <= (breakpointOverride || MOBILE_BREAKPOINT);
}

