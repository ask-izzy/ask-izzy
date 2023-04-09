import React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import LinkListItem from "@/src/components/LinkListItem.js";
import icons from "@/src/icons/index.js";
import type Category from "@/src/constants/Category.js";
import Storage from "@/src/storage.js";
import ScreenReader from "@/src/components/ScreenReader.js"
import { getServicesPath } from "@/src/utils/routing.js"

type Props = {
    category: Category,
    router?: NextRouter,
}

const PERSONALISATIONS_TO_CLEAR = [
    "are-you-safe",
    "sub-indigenous",
    "dfv-demographics",
]

function CategoryListItem({category, router}: Props) {
    /*
     * This is to prevent confusion when going between categories which share,
     * the same questions
     * eg - going from domestic violence to housing, and having the
     * 'Are you safe' response appear in the breadcrumb.
     *
     * This may not be needed with filters
     */
    function clearAreYouSafe(event?: Event): void {
        PERSONALISATIONS_TO_CLEAR.forEach(answer => {
            if (Storage.getItem(answer)) {
                Storage.removeItem(answer)
            }
        })
        const directPath = getServicesPath({
            router: router,
            category: category,
        })
        router.push(directPath)

        event?.preventDefault()
    }

    const Icon: any = category.icon || icons.House;

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
    )
}

export default withRouter(CategoryListItem)