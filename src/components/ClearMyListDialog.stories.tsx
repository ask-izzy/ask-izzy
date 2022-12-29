import React, {useState, ReactNode} from "react";

import ClearMyListDialogComponent from "@/src/components/ClearMyListDialog.js";

export default {
    title: "App Components/Dialog/ClearMyListDialog",
    component: ClearMyListDialogComponent
};
export const ClearMyListDialog = (): ReactNode => {
    const [open, setOpen] = useState(true);
    return <>
        <button onClick={() => setOpen(true)}>Open clear my list dialog</button>
        {
            open &&
            <ClearMyListDialogComponent
                onCloseRequested={() => setOpen(false)}
                onClearMyList={() => setOpen(false)}
            />
        }

    </>;
};