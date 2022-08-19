/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState} from "react";

import ClearMyListDialogComponent from "./ClearMyListDialog";

export default {
    title: "App Components/Dialog/ClearMyListDialog",
    component: ClearMyListDialogComponent,
};

export const ClearMyListDialog = (args: Object): ReactNode => {
    const [open, setOpen] = useState(true)
    return <>
        <button onClick={() => setOpen(true)}>Open clear my list dialog</button>
        {open &&
        <ClearMyListDialogComponent
            onCloseRequested={() => setOpen(false)}
            onClearMyList={() => setOpen(false)}
        />
        }

    </>;
}
