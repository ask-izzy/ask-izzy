/* @flow */
import {useState} from "react";

export default (): [boolean, () => void] => {
    const [forceUpdateState, setForceUpdateState] = useState<boolean>(false)

    function forceUpdate() {
        setForceUpdateState(!forceUpdateState)
    }

    return [forceUpdateState, forceUpdate]
};

