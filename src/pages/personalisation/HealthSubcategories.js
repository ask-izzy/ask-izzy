/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";
import { resetDfvOptions } from "../../utils/domesticViolence";

function specialist(query) {
    return remove("(community health)").append(query);
}

export default class HealthSubcategories extends BaseQuestion {
    static title: string = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            "Doctor": remove("(community health)")
                .append("(general medical practitioners)"),
            "Nurse": append("nurse"),
            "Social & emotional wellbeing": specialist("(mental health)"),
            "Domestic & family violence": append("health (Family violence)")
                .remove("(community health)"),
            "Sexual assault": append("(sexual assault)")
                .remove("(community health)"),
            "Sexual health": specialist("(sexual health)"),
            "Dentist": specialist("dentistry"),
            "Problems with feet": specialist("podiatry"),
            "Eye care": specialist("optometry"),
            "Children": remove("(community health)")
                .append("health children"),
            "Maternal & child health": remove("(community health)")
                .remove({show_in_askizzy_health: true})
                .append("(maternal child health)"),
            "Hospital": remove("(community health)")
                .remove({show_in_askizzy_health: true})
                .append("(public hospital services)")
                .append("-pac")
                .append("-medicare"),
        },
        answersDesc: {
            "Doctor": "General medical services in community health centres",
            "Nurse": "Community nursing & district nursing services",
            "Social & emotional wellbeing": "Services for those that " +
                "want to talk about their mental health",
            "Domestic & family violence": "Counselling and support " +
                "services for those who have been hurst " +
                "by a partner or family member",
            "Sexual assault": "Counselling and support " +
                "services for those who have been " +
                "hurt by a partner or family member",
            "Sexual health": "Services to help with " +
                "sexually transmitted infections, " +
                "contraception and pregnancy termination",
            "Dentist": "Dental Services",
            "Problems with feet": "Podiatry Services",
            "Eye care": "Eye testing and care services",
            "Children": "Health services for children",
            "Maternal & child health": "Support programs and " +
                "services for new mothers",
            "Hospital": "Public hospitals & emergency departments",
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Social & emotional wellbeing":
            return "Mental health";
        case "Problems with feet":
            return "Podiatry";
        case "Domestic & family violence":
            return "Domestic & family violence help";
        case "Sexual assault":
            return "Sexual assault support";
        case "Children":
            return "For children";
        case "Hospital":
            return "Hospitals";
        default:
            return this.answer
        }
    }
}
