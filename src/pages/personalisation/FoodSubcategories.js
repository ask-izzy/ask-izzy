/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import { append, remove } from "../../iss/Search";

export default class FoodSubcategories extends BaseQuestion {
    static title: string = "Services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-food",
        question: "What do you need help with?",
        mandatory: true,
        answers: {
            "Finding a free meal nearby":
                append(
                    "meals -(coordinating bodies) -(food safety) -(home care)" +
                    " -(meals on wheels) -(assistance with meals)" +
                    " -(hire of facilities) -chsp -(meal preparation)"
                ).append({catchment: "prefer"}),
            "Meals on Wheels": append("(meals on wheels)")
                .append({catchment: "prefer"}),
            "Food packages/parcels/vouchers":
                append(
                    "(Food Parcels & Food Vouchers) -(coordinating bodies) " +
                    "-(food safety) -(home care) -(meals on wheels) " +
                    "-(assistance with meals) -(hire of facilities) -chsp " +
                    "-(meal preparation)"
                ).append({
                    service_type: ["material aid"],
                    catchment: "prefer",
                }),
            "Transport":
                append({catchment: "prefer"})
                    .append("transport")
                    .append("travel")
                    .append("-hacc"),
            "Swags and blankets":
                append("swags blankets -(coordinating bodies)")
                    .append({catchment: "prefer"}),
            "Clothes": append("clothes -(coordinating bodies)")
                .append({catchment: "prefer"}),
            "Showers": append("showers -(coordinating bodies)")
                .append({catchment: "prefer"}),
            "Toiletries":
                append(
                    "toiletries (sanitary products) tampons " +
                    "-(coordinating bodies)"
                ).append({
                    service_type: ["material aid"],
                    catchment: "prefer",
                }),
            "Laundry": append("laundry washing drying -(coordinating bodies)")
                .append({
                    service_type: ["material aid"],
                    catchment: "prefer",
                }),
            "Household goods":
                append("(household goods) -(coordinating bodies)")
                    .append({
                        service_type: ["material aid"],
                        catchment: "prefer",
                    }),
            "Help with pets":
                append("assistance pets")
                    .append("-(animal control)")
                    .append("-effectiveness"),
        },
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Food packages/parcels/vouchers":
            return "Parcels/vouchers";
        default:
            return this.answer
        }
    }
}
