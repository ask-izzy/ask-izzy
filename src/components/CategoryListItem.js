/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import LinkListItem from "./LinkListItem";
import icons from "../icons";
import type Category from "../constants/Category";
import Storage from "../storage";
import ScreenReader from "./ScreenReader"

type Props = {
    category: Category,
}

const PERSONALISATIONS_TO_CLEAR = [
    "are-you-safe",
    "sub-indigenous",
    "dfv-demographics",
]

function CategoryListItem({category}: Props): ReactNode {
    /**
     * This is to prevent confusion when going between categories which share,
     * the same questions
     * eg - going from domestic violence to housing, and having the
     * 'Are you safe' response appear in the breadcrumb.
     *
     * This may not be needed with filters
     * @return - Nothing
     */

    function clearAreYouSafe() {
        PERSONALISATIONS_TO_CLEAR.forEach(answer => {
            if (Storage.getItem(answer)) {
                Storage.removeItem(answer)
            }
        })
    }

    let Icon = category.icon || icons.House;

    return (
        <LinkListItem
            className="CategoryListItem hero"
            to={`/${category.key}`}
            leftIcon={
                <Icon className="ColoredIcon icon-fg-color big" />
            }
            onClick={clearAreYouSafe}
            rightIcon={<icons.Chevron aria-hidden={true} />}
            primaryText={<>
                {category.name}
                <ScreenReader>,</ScreenReader>
            </>}
            secondaryText={category.byline}
            analyticsEvent={{
                event: "Link Followed - Category",
                eventAction: "Category",
                eventLabel: category.key,
            }}
        />
    );
}

export default CategoryListItem;
