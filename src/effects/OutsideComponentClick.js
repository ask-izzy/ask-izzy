/* @flow */

import {useEffect, useState} from "react";

export function OutsideComponentClick(ref): boolean {
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
        function handleClickOutside(event) {
            setClicked(ref.current && !ref.current.contains(event.target));
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return clicked
}
