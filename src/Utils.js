import {Constants as SConstants} from "s-forms";
import JsonLdUtils from "jsonld-utils";

export default class Utils {

  static findParent(root, id) {

    if (!root) {
      return null;
    }

    const subQuestions = root[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {

      for (const subQuestion of subQuestions) {

        if (subQuestion['@id'] === id) {
          return root;
        }

        const found = Utils.findParent(subQuestion, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  static findDirectChild(parent, id) {

    if (!parent) {
      return null;
    }

    const subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {

      for (let i = 0; i < subQuestions.length; i++) {
        if (subQuestions[i]['@id'] === id) {
          return { q: subQuestions[i], index: i };
        }
      }
    }

    return null;
  }

  static isReferencedBySibling(parent, referencedQuestionId, property) {
    if (!parent) {
      return false;
    }

    const subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {

      for (const subQuestion of subQuestions) {
        const propertyValue = subQuestion[property];
        if (!propertyValue) {
          continue;
        }

        if (propertyValue === referencedQuestionId) {
          return true;
        }

        if (propertyValue['@id'] === referencedQuestionId) {
          return true;
        }
      }
    }

    return false;
  }

  static hasSubQuestionWithValue(parent, property, value) {

    let subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {
      for (let subQuestion of subQuestions) {
        if (JsonLdUtils.hasValue(subQuestion, property, value)) {
          return true;
        }
      }
    }

    return false;
  }

  // static _findQuestion(question, id) {
  //
  //   if (question['@id'] === id) {
  //     return question;
  //   }
  //
  //   const subQuestions = question[SConstants.HAS_SUBQUESTION];
  //   if (subQuestions && subQuestions.length) {
  //
  //     for (const subQuestion of subQuestions) {
  //       const found = _QuestionWithUnit._findQuestion(subQuestion, id);
  //       if (found) {
  //         return found;
  //       }
  //     }
  //   }
  //
  //   return null;
  // }

}
