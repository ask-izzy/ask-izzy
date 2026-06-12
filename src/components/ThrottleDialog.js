/* @flow */
import React, {useState, useEffect} from "react";
import type {Node as ReactNode} from "react";
import Dialog from "@/components/base/Dialog"
import { useRouter } from "next/router";
import cnx from "classnames"
import { REQUEST_ORG_THROTTLED_COOKIE } from "@/src/utils/nextjs-middleware/rate-limiting.js";
import { useLocalAlerts } from "@/src/hooks/useLocalAlerts";
import StrapiMarkdown from "@/src/components/StrapiMarkdown";
import { dedent } from "ts-dedent";

export default function ThrottleDialog(): ReactNode {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)
    const [requestOrgId, setRequestOrgId] = useState<string | null>(null)
    const router = useRouter()
    const { addAlert, removeAlert } = useLocalAlerts()

    const title = "Usage Limited"

    // Update requestOrgId on cookie change
    useEffect(() => {
        const cookieRegex = new RegExp(`(?:^|;\\s*)${REQUEST_ORG_THROTTLED_COOKIE}=([^;]*)`)
        const cookieMatch = document.cookie.match(cookieRegex)
        const cookieOrgId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null
        // We don't clear requestOrgId if it is removed from us falling back under the rate limit amount because if the
        // request rate is around about the rate limit amount then requestOrgId could be rapidly set and unset which
        // would cause the message to be repeatedly added and removed. If the user has fallen back under the rate limit
        // amount the the message will be moved next time reload or close and open the page.
        if (cookieOrgId && requestOrgId !== cookieOrgId) {
            setRequestOrgId(cookieOrgId)
        }
    }, [requestOrgId, router.pathname, router.isReady])

    // Update model visibility on requestOrgId change
    useEffect(() => {
        if (requestOrgId) {
            setOpen(true)
            addAlert({
                documentId: "throttle-dialog",
                title,
                body: bodyText(requestOrgId),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                alertLevel: "warn",
                defaultToOpen: false,
                states: [],
                screenLocation: "top",
            })
        } else {
            setOpen(false)
            removeAlert("throttle-dialog")
        }
    }, [requestOrgId])

    // If no throttling is needed then don't render anything
    if (!requestOrgId) {
        return null
    }

    function article(text: string): ReactNode {
        return "aeiou".includes(text[0].toLowerCase()) ? "an" : "a"
    }

    function bodyText(requestOrgId: string) {
        if (requestOrgId === "services-australia") {
            return dedent`
                Recently Services Australia opted to no longer continue a contract with Infoxchange, the makers of
                Ask Izzy. As such usage by Services Australia is now in violation of Ask Izzy's
                [Terms of use](/terms).

                If you are someone looking for help for yourself please disregard this message
                and continue to use Ask Izzy as normal.

                If you are a Services Australia employee please contact your manager for more information.
            `
        } else {
            const orgName = requestOrgId.replace("-", " ")

            return dedent`
                The organisation, ${orgName}, has been detected as violating Ask Izzy's
                [Terms of use](/terms).

                If you are someone looking for help for yourself please disregard this message
                and continue to use Ask Izzy as normal.

                If you are ${article(orgName)} ${orgName} employee please contact your manager for
                more information.
            `
        }
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            title={title}
        >
            {({bodyClassName}) => (
                <div className={cnx("ThrottleDialog", bodyClassName)}>
                    <StrapiMarkdown>
                        {bodyText(requestOrgId)}
                    </StrapiMarkdown>
                </div>
            )}
        </Dialog>
    )
}
