import React from "react";
import classnames from "classnames";

import Link from "@/src/components/base/Link";
import ListItem, {Props as ListItemProps} from "@/src/components/ListItem";
import type {AnalyticsEvent} from "../google-tag-manager";

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
