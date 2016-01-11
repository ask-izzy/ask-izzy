/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class TechnologySubcategories extends BaseMultiQuestion {
    static title = "Technology";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-technology",
        question: "What do you want help with?",
        answers: {
            "Finding wifi": remove("computer classes"),
            "Finding a computer": remove("wifi internet computer classes")
                .append("computer internet kiosk"),
            "Help to use a computer": remove("wifi internet")
                .append("-employment -preschool -school"),
            "Somewhere to charge": remove("wifi internet computer classes")
                .append("recharge -cardiac"),
        },
    };
}
