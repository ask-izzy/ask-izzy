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
import AreYouSafePersonalisation from "@/src/constants/personalisation-pages/AreYouSafe";
import DemographicsIndigenous from "@/src/constants/personalisation-pages/DemographicsIndigenous";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics";
import DemographicsAtsiCald from "@/src/constants/personalisation-pages/DemographicsAtsiCald";
import DemographicsAtsiCaldLgbtiqa from "@/src/constants/personalisation-pages/DemographicsAtsiCaldLgbtiqa";

type Props = {
    category: Category,
    router: NextRouter,
}

const PERSONALISATIONS_TO_CLEAR = [
    AreYouSafePersonalisation.name,
    DemographicsIndigenous.name,
    DfvDemographics.name,
    DemographicsAtsiCald.name,
    DemographicsAtsiCaldLgbtiqa.name,
]

function CategoryListItem({category, router}: Props): ReactNode {
    /*
     * This is to prevent confusion when going between categories which share,
     * the same questions
     * eg - going from domestic violence to housing, and having the
     * 'Are you safe' response appear in the breadcrumb.
     *
     * This may not be needed with filters
     */
    function clearAreYouSafe(event): void {
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
    )
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
