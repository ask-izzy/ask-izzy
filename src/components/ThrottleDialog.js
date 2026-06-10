/* $FlowIgnore */

import React from "react";
import Dialog from "@/components/base/Dialog"
import Link from "@/src/components/base/Link";
import cnx from "classnames"

type Props = {
    requestOrgId: string,
}

export default function ThrottleDialog({ requestOrgId }: Props) {
    const [open, setOpen] = React.useState(true)
    const close = () => setOpen(false)

    function renderBody() {
        if (requestOrgId === "services-australia") {
            return <>
                <p>
                    Recently Services Australia opted to no longer continue a contract with Infoxchange, the makers of
                    Ask Izzy. As such usage by Services Australia is now in violation of Ask Izzy's
                    {" "}<Link to="/terms">Terms of use</Link>.
                </p>
                <p>
                    If you are someone looking for help for yourself please disregard this message
                    and continue to use Ask Izzy as normal.
                </p>
                <p>
                    If you are a Services Australia employee please contact your manager for more information.
                </p>
            </>
        } else {
            return <>
                <p>
                    The organisation, {requestOrgId.replace("-", " ")}, has been detected as violating Ask Izzy's
                    {" "}<Link to="/terms">Terms of use</Link>.
                </p>
                <p>
                    If you are someone looking for help for yourself please disregard this message
                    and continue to use Ask Izzy as normal.
                </p>
                <p>
                    If you are a {requestOrgId.replace("-", " ")} employee please contact your manager for more
                    information.
                </p>
            </>
        }
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            title="Usage Limited"
        >
            {({bodyClassName}) => (
                <div className={cnx("ThrottleDialog", bodyClassName)}>
                    {renderBody()}
                </div>
            )}
        </Dialog>
    )
}
