/* @flow */

import {useEffect, useState} from "react";

export function OutsideComponentClick(ref): boolean {
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
        console.log(ref.current)
        setClicked(!!ref.current?.classNames?.includes("open"))
    }, [ref]);

    return clicked
}
