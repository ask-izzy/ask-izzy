/* @flow */

import {useEffect, useState} from "react";

/* $FlowIgnore */
export function OutsideComponentClick(ref): ?boolean {
    // We initialise it to undefined to prevent the component
    // related to the click event from being activated
    const [clicked, setClicked] = useState(undefined)
    useEffect(() => {
        function handleClickOutside(event: Event) {
            setClicked(ref?.current && !ref.current.contains(event.target));
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
