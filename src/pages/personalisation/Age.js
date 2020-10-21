/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import storage from "../../storage";

function ageGroups(
    ...groups: Array<issAgeGroup>
): {age_group: Array<issAgeGroup>} {
    return {
        age_group: ["unspecified"].concat(groups),
    }
}

export default class Age extends BaseQuestion {
    static title = "Age";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        byline: "You don't have to answer, but this helps us give you better results",
        answers: {
            "0 to 17": append(ageGroups(
                "prenatal",
                "baby",
                "toddler",
                "preschool",
                "schoolage",
                "earlyadolescent",
                "midadolescent",
                "lateadolescent"
            )).append("children").append("youth"),
            "18 to 26": append(ageGroups(
                "youngadult",
            )),
            "27 to 39": append(ageGroups(
                "adult",
            )),
            "40 to 54": append(ageGroups(
                "middleagedadult",
            )),
            "55 to 64": append(ageGroups(
                "preretirementage",
            )),
            "65 or older": append(ageGroups(
                "agedpersons",
            )).append("aged"),
        },
    };

    componentDidMount() {
        super.componentDidMount && super.componentDidMount()
        // Cheep hack to skip if centerlink
        // If we need to skip more pages in future based on answers
        // then spend some time writing more comprehensive solution
        if (
            this.props.category && this.props.category.slug === 'money' && 
            storage.getItem('sub-money') === 'Centrelink'
        ) {
            this.onNextStep()
            this.props.onDoneTouchTap()
        }

    }

    static headingValue(): string {
        if (!this.answer || (this.answer === "(skipped)")) {
            return "";
        } else {
            return `aged ${this.answer}`;
        }
    }
}
