/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import DemographicsIndigenous from "./DemographicsIndigenous";

export default ({
    ...DemographicsIndigenous,
    name: DemographicsIndigenous.name + "-health",
}: PersonalisationQuestionPage)
