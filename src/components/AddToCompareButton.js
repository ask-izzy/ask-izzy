/* @flow */

import type {Node as ReactNode} from "react"
import React from "react";
import Button from "./base/Button";
import AddToCompare from "../icons/AddToCompare"
import RemoveFromCompare from "../icons/RemoveFromCompare"
import classnames from "classnames";
import useMyList from "@/hooks/useMyList"
import Service from "@/src/iss/Service"
import * as gtm from "@/src/google-tag-manager";

type Props = {
    hasTextDescription?: boolean,
    service: Service,
    className?: string,
}

function AddToCompareButton({
    hasTextDescription = false,
    service,
    className,
}: Props): ReactNode {
    const {
        myListServices,
        addServiceToMyList,
        removeServiceFromMyList,
    } = useMyList()

    let serviceIsInList = myListServices.some((myListService) => myListService.id === service.id)

    const addToCompareText = "Add to My List"
    const removeFromCompareText = "Remove from My List"
    const textDescription = serviceIsInList ? removeFromCompareText : addToCompareText

    function onClick(): void {
        if (serviceIsInList) {
            removeServiceFromMyList(service)
        } else {

            if (myListServices.length === 0) {
                gtm.emit({
                    event: "Action Triggered - New List",
                    eventCat: "Action triggered",
                    eventAction: "New list",
                    eventLabel: null,
                    eventValue: myListServices.length,
                    sendDirectlyToGA: true,
                });
            }
            gtm.emit({
                event: "Action Triggered - List Size Changed",
                eventCat: "Action triggered",
                eventAction: "List size changed",
                eventLabel: null,
                eventValue: myListServices.length,
                sendDirectlyToGA: true,
            });
            addServiceToMyList(service)
        }
    }

    return (
        <Button
            className={
                classnames(
                    "AddToCompareButton",
                    className,
                    {"AddToCompare": !serviceIsInList, "RemoveFromCompare": serviceIsInList}
                )
            }
            onClick={onClick}
            aria-label={serviceIsInList ? "Remove from my list" : "Add to my list"}
            analyticsEvent={{
                event: `Action Triggered - Service ${serviceIsInList ? "Removed From" : "Added To"} List`,
                eventAction: `Service ${serviceIsInList ? "removed from" : "added to"} list`,
                eventLabel: String(service.id),
            }}
        >
            <div className="main-container">
                {
                    serviceIsInList ? <RemoveFromCompare className={classnames({"has-no-text": !hasTextDescription})}/>
                        : <AddToCompare className={classnames({"has-no-text": !hasTextDescription})}/>
                }
                {
                    hasTextDescription ?
                        <span className="text-description">{textDescription}</span>
                        : null
                }
            </div>
        </Button>
    )
}

export default AddToCompareButton
