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
   * Wraps passed object into new array if it is not array already.
   * @param object_or_array An object or array.
   * @returns {*} New array containing passed object or passed array.
   */
  static asArray(object_or_array) {
    if (!object_or_array) {
      return [];
    }
    if (object_or_array.constructor === Array) {
      return object_or_array;
    }
    return [object_or_array];
  }

  /**
   * Gets array of values of the specified attribute.
   *
   * If the attribute value is a string, it is returned, otherwise a '@value' attribute is retrieved from the nested
   * object.
   * @param obj Object from which the attribute value will be extracted
   * @param att Attribute name
   * @param by (optional) JSON attribute to use instead of '@value' in case the att value is an object
   * @return {*} Array of attribute values (possibly null)
   */
  static getJsonAttValues(obj, att, by = null) {
    if (obj[att] === null || obj[att] === undefined) {
      return null;
    }
    return Utils.asArray(obj[att]).map(v => typeof v === 'object' ? v[by ? by : '@value'] : v )
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
