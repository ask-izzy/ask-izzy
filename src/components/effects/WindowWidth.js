import {useEffect, useState} from "react";

export function windowWidth() {
    const [width, setWidth] = useState(undefined);
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

