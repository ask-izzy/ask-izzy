import React from "react";
import classnames from "classnames";

import Link from "@/src/components/base/Link.js";
import ListItem, {Props as ListItemProps} from "@/src/components/ListItem.js";
import type {AnalyticsEvent} from "../google-tag-manager.js";

type Props = {
    to?: string
    analyticsEvent?: AnalyticsEvent
} & ListItemProps


function LinkListItem({className, ...rest}: Props) {
    return (
        <ListItem
            {...rest}
            rootElement={Link}
            className={classnames(
                "plain-text",
                className,
            )}
        />
    )

}

export default LinkListItem
