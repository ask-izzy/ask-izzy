import React, {useState, ReactNode} from "react";
import Dialog from "@/components/base/Dialog.js";

export default {
    title: "App Components/Dialog",
    component: Dialog
};

export const Example = (): ReactNode => {
    const [open, setOpen] = useState(true);
    return <>
        <button onClick={() => setOpen(true)}>Open dialog</button>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >
            {({
                titleProps
            }) =>
                <div
                    {...titleProps}
                    style={{
                        backgroundColor: "grey",
                        padding: "0.5em 2em 2em"
                    }}
                >
                    <h1>Lorem ipsum dolor sit amet</h1>
                    <p>
                        Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    </p>
                    <button onClick={() => setOpen(false)}>Close dialog</button>
                </div>}
        </Dialog>
    </>;
};