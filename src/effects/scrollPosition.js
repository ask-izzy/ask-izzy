/* @flow */

import {useEffect, useState} from "react";

export function getScrollPosition(): number {
    const [scrollPosY, setScrollPosY] = useState<number>(0);
    useEffect(() => {
        function handleScroll() {
            setScrollPosY(window.pageYOffset)
        }

        document.addEventListener("scroll", handleScroll)

        return () => document.removeEventListener("scroll", handleScroll);
    }, []);

    return scrollPosY;
}
