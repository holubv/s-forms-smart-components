import CompositeQuestion from "./components/CompositeQuestion";
import JsonLdUtils from "jsonld-utils";
import Constants from "./Constants";
import QuestionWithAdvanced from "./components/QuestionWithAdvanced";
import {Constants as SConstants, FormUtils} from "s-forms";
import WizardStepWithAdvanced from "./components/WizardStepWithAdvanced";
import QuestionWithUnit from "./components/QuestionWithUnit";
import NullQuestion from "./components/NullQuestion";
import Utils from "./Utils";

export default class SmartComponents {

  static componentCache = {};

  static _cached(q, form, componentName, mapRule) {

    let cachedQuestion = SmartComponents.componentCache[q['@id']];
    if (cachedQuestion === undefined) {
      cachedQuestion = {};
      SmartComponents.componentCache[q['@id']] = {};
    }

    let cachedValue = cachedQuestion[componentName];
    if (cachedValue === undefined) {
      cachedValue = mapRule(q, form);
      SmartComponents.componentCache[q['@id']][componentName] = cachedValue;
    }

    return cachedValue;
  }

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
      },
      {
        component: NullQuestion,
        mapRule: (q, form) => SmartComponents._cached(q, form, 'NullQuestion', () => {
          const parent = Utils.findParent(form?.root, q['@id']);
          return !!(parent && Utils.isReferencedBySibling(parent, q['@id'], Constants.HAS_UNIT_OF_MEASURE));
        })
      },
      {
        component: NullQuestion,
        mapRule: q => {
          return !!q[Constants.SHOW_ADVANCED_QUESTION]
        }
      },
      {
        component: QuestionWithUnit,
        mapRule: q => {
          return !!q[Constants.HAS_UNIT_OF_MEASURE]
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
