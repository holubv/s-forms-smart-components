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

  static findChild(parent, id) {

    if (!parent) {
      return null;
    }

    if (parent['@id'] === id) {
      return parent;
    }

    const subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {

      for (let subQuestion of subQuestions) {
        let found = Utils.findChild(subQuestion, id);
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

  static isReferencedByProperty(questions, questionId, property) {

    if (questions && questions.length) {

      for (const question of questions) {
        if (Utils.hasPropertyWithValue(question, property, questionId)) {
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

  static hasPropertyWithValue(question, property, value) {
    if (!question) {
      return false;
    }

    const propValue = question[property];
    if (!propValue) {
      return false;
    }

    if (Array.isArray(propValue) && propValue.includes(value)) {
      return true;
    }

    if (propValue === value) {
      return true;
    }

    if (propValue['@id'] === value) {
      return true;
    }

    return false;
  }

  /**
   * @param {string[]} arr1
   * @param {string[]} arr2
   */
  static hasArraySameValues(arr1, arr2) {

    if (!arr1 || !arr2) {
      return false;
    }

    if (arr1.length === undefined) {
      return false;
    }

    if (arr1.length !== arr2.length) {
      return false;
    }

    const set = {};
    for (let el of arr1) {
      set[el] = 1;
    }

    for (let el of arr2) {
      if (!set[el]) {
        return false;
      }
      set[el] = 2;
    }

    return Object.values(set).every(el => el === 2);
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
