import CompositeQuestion from "./components/CompositeQuestion";
import JsonLdUtils from "jsonld-utils";
import Constants from "./Constants";
import QuestionWithAdvanced from "./components/QuestionWithAdvanced";
import {Constants as SConstants, FormUtils} from "s-forms";
import WizardStepWithAdvanced from "./components/WizardStepWithAdvanced";
import QuestionWithUnit from "./components/QuestionWithUnit";
import NullQuestion from "./components/NullQuestion";
import Utils from "./Utils";
import SectionComponent from "./components/SectionComponent";
import TypeQuestion from "./components/TypeQuestion";

export default class SmartComponents {

  static componentCache = {};

  static _cached(q, form, key, mapRule) {

    let cachedQuestion = SmartComponents.componentCache[q['@id']];
    if (cachedQuestion === undefined) {
      cachedQuestion = {};
      SmartComponents.componentCache[q['@id']] = {};
    }

    let cachedValue = cachedQuestion[key];
    if (cachedValue === undefined) {
      cachedValue = mapRule(q, form);
      SmartComponents.componentCache[q['@id']][key] = cachedValue;
    }

    return cachedValue;
  }

  static getComponentMapping() {
    return [
      {
        component: WizardStepWithAdvanced,
        mapRule: WizardStepWithAdvanced.mappingRule
      },
      {
        component: SectionComponent,
        mapRule: SectionComponent.mappingRule
      },
      {
        component: CompositeQuestion,
        mapRule: CompositeQuestion.mappingRule
      },
      {
        component: QuestionWithAdvanced,
        mapRule: QuestionWithAdvanced.mappingRule
      },
      {
        component: NullQuestion,
        mapRule: (q, form) => SmartComponents._cached(q, form, 'NullQuestion-unit-of-measure', () => {
          const parent = Utils.findParent(form?.root, q['@id']);
          return !!(parent && Utils.isReferencedByProperty(parent[SConstants.HAS_SUBQUESTION], q['@id'], Constants.HAS_UNIT_OF_MEASURE));
        })
      },
      {
        component: NullQuestion,
        mapRule: (q, form) => SmartComponents._cached(q, form, 'NullQuestion-type-question', () => {
          const parent = Utils.findParent(form?.root, q['@id']);
          return Utils.hasPropertyWithValue(parent, Constants.HAS_TYPE_QUESTION, q['@id']);
        })
      },
      // {
      //   component: NullQuestion,
      //   mapRule: q => {
      //     return !!q[Constants.SHOW_ADVANCED_QUESTION]
      //   }
      // },
      {
        component: QuestionWithUnit,
        mapRule: q => {
          return !!q[Constants.HAS_UNIT_OF_MEASURE]
        }
      }
    ];
  }

}
