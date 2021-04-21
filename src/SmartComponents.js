import CompositeQuestion from "./components/CompositeQuestion";
import JsonLdUtils from "jsonld-utils";
import Constants from "./Constants";
import QuestionWithAdvanced from "./components/QuestionWithAdvanced";
import {Constants as SConstants, FormUtils} from "s-forms";
import WizardStepWithAdvanced from "./components/WizardStepWithAdvanced";

export default class SmartComponents {

  static getComponentMapping() {
    return [
      {
        component: CompositeQuestion,
        mapRule: q => JsonLdUtils.getJsonAttValue(q, Constants.COMPOSITE_PATTERN)
      },
      {
        component: QuestionWithAdvanced,
        mapRule: q => {
          return SmartComponents._hasAdvancedQuestion(q) && !FormUtils.isWizardStep(q);
        }
      },
      {
        component: WizardStepWithAdvanced,
        mapRule: q => {
          return SmartComponents._hasAdvancedQuestion(q) && FormUtils.isWizardStep(q);
        }
      }
    ];
  }

  static _hasAdvancedQuestion(q) {

    if (!FormUtils.isSection(q) && !FormUtils.isAnswerable(q)) {
      return false;
    }
    let subQuestions = q[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {
      for (let subQuestion of subQuestions) {
        if (JsonLdUtils.hasValue(subQuestion, Constants.SHOW_ADVANCED_QUESTION, true)) {
          return true;
        }
      }
    }
    return false;

  };

}