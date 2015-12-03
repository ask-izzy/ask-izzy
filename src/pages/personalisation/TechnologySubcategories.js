/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class TechnologySubcategories extends BaseMultiQuestion {
    static title = "Technology";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-technology",
        question: "What do you want help with?",
        answers: {
            "Finding wifi": append("wifi"),
            "Finding a computer": append("computer"),
            "Help to use a computer": append("computer class"),
            "Somewhere to charge": append("charge"),
        },
    };
}
