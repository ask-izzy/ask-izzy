/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import LinkListItem from "./LinkListItem";
import icons from "../icons";
import type Category from "../constants/Category";
import Storage from "../storage";
import ScreenReader from "./ScreenReader"
import { getServicesPath } from "@/src/utils/routing"

type Props = {
    category: Category,
    router: NextRouter,
}

const PERSONALISATIONS_TO_CLEAR = [
    "are-you-safe",
    "sub-indigenous",
    "dfv-demographics",
]

class CategoryListItem extends React.Component<Props, void> {
    /*
     * This is to prevent confusion when going between categories which share,
     * the same questions
     * eg - going from domestic violence to housing, and having the
     * 'Are you safe' response appear in the breadcrumb.
     *
     * This may not be needed with filters
     */
    clearAreYouSafe(event: SyntheticEvent<HTMLAnchorElement>): void {
        PERSONALISATIONS_TO_CLEAR.forEach(answer => {
            if (Storage.getItem(answer)) {
                Storage.removeItem(answer)
            }
        })
        const directPath = getServicesPath({
            router: this.props.router,
            category: this.props.category,
        })
        this.props.router.push(directPath)

        event?.preventDefault()
    }

    render(): ReactNode {
        let Icon = this.props.category.icon || icons.House;

        return (
            <LinkListItem
                className="CategoryListItem hero"
                to={`/${this.props.category.key}`}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color big" />
                }
                onClick={this.clearAreYouSafe.bind(this)}
                rightIcon={<icons.Chevron aria-hidden={true} />}
                primaryText={<>
                    {this.props.category.name}
                    <ScreenReader>,</ScreenReader>
                </>}
                secondaryText={this.props.category.byline}
                analyticsEvent={{
                    event: "Link Followed - Category",
                    eventAction: "Category",
                    eventLabel: this.props.category.key,
                }}
            />
        );
    }
}

export default (
    withRouter(CategoryListItem):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof CategoryListItem>,
                    {router: *}
                >
            >
        >
)
