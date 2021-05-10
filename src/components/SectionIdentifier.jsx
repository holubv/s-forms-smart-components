import React from 'react';
import PropTypes from "prop-types";
import {FormUtils, Constants as SConstants, JsonLdObjectMap, ConfigurationContext} from "s-forms";
import Constants from "../Constants";
import Utils from "../Utils";
import JsonLdUtils from "jsonld-utils";

export default class SectionIdentifier extends React.Component {

  static contextType = ConfigurationContext;

  static propTypes = {
    question: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    suffix: PropTypes.string
  }

  static defaultProps = {
    prefix: '',
    suffix: ''
  }

  _getIdentifyingQuestionId() {
    const question = this.props.question;
    let id = question[Constants.HAS_IDENTIFYING_QUESTION];
    if (!id) {
      return null;
    }

    if (Array.isArray(id)) {
      id = id[0];
    }

    return id;
  }

  _getLabelText() {
    //return "Pavel Novotný";
    const question = this.props.question;
    const id = this._getIdentifyingQuestionId();
    if (!id) {
      return null;
    }

    const identifyingQuestion = Utils.findChild(question, id);
    if (!identifyingQuestion) {
      return null;
    }

    const answers = identifyingQuestion[SConstants.HAS_ANSWER];
    if (!answers || !answers.length) {
      return null;
    }

    const answer = FormUtils.resolveValueObject(answers[0]);
    if (!answer) {
      return null;
    }

    console.log(answer);

    if (answer['@value']) {

      if (FormUtils.isCheckbox(identifyingQuestion)) {
        return JsonLdUtils.getLocalized(identifyingQuestion[SConstants.RDFS_LABEL], this.context.options.intl);
      }

      return answer['@value'];
    }

    if (answer['@id']) {
      // answer is object with id
      let def = JsonLdObjectMap.getObject(id);
      if (!def) {
        return null;
      }

      let label = JsonLdUtils.getLocalized(def[SConstants.RDFS_LABEL], this.context.options.intl);
      if (label) {
        return label;
      }
    }

    return null;
  }

  render() {
    const text = this._getLabelText();
    if (text) {
      return (
        <span className="section-identifier">{this.props.prefix}{text}{this.props.suffix}</span>
      );
    }

    return null;
  }


}

