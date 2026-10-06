import type {ReactNode} from "react";
import React, {useState} from "react";

import ClearMyListDialogComponent from "./ClearMyListDialog";

export default {
    title: "App Components/Dialog/ClearMyListDialog",
    component: ClearMyListDialogComponent,
};

export const ClearMyListDialog = (args: any): ReactNode => {
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
