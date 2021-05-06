import React from 'react';
import {Accordion, Card, Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {Question, FormUtils, Constants as SConstants, HelpIcon, Answer, ConfigurationContext} from 's-forms';
import Constants from "../Constants";
import classNames from 'classnames';
import JsonldUtils from 'jsonld-utils';
import PropTypes from "prop-types";
import Utils from "../Utils";

export default class ShowAdvancedSwitch extends Question {

  static mappingRule = q => Utils.hasSubQuestionWithValue(q, Constants.SHOW_ADVANCED_QUESTION, true);

  static findShowAdvancedQuestion(parent) {

    let subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {
      for (let i = 0; i < subQuestions.length; i++) {
        if (JsonLdUtils.hasValue(subQuestions[i], Constants.SHOW_ADVANCED_QUESTION, true)) {
          return {index: i, question: subQuestions[i]};
        }
      }
    }

    return null;
  }

  static isShowAdvanced(question) {

    let value = false;

    if (question[SConstants.HAS_ANSWER] && question[SConstants.HAS_ANSWER].length) {
      let answer = question[SConstants.HAS_ANSWER][0];
      if (answer[SConstants.HAS_DATA_VALUE]) {
        value = !!answer[SConstants.HAS_DATA_VALUE]['@value'];
      }
    }

    return value;
  }

  constructor(props) {
    super(props);
  }

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(SConstants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  _getShowAdvancedQuestion() {
    return ShowAdvancedSwitch.findShowAdvancedQuestion(this.props.question);
  }

  _getShowAdvancedState() {
    let {question} = this._getShowAdvancedQuestion();
    return ShowAdvancedSwitch.isShowAdvanced(question);
  }

  _toggleAdvanced = (e) => {
    e.stopPropagation();

    let {index, question} = this._getShowAdvancedQuestion();

    let value = this._getShowAdvancedState();

    question[SConstants.HAS_ANSWER] = [{}];
    question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {'@value': !value}
    question[SConstants.HAS_VALID_ANSWER] = true;

    this._onChange(SConstants.HAS_SUBQUESTION, index, question);
  };

  _renderShowAdvancedHelp() {
    const {question} = this._getShowAdvancedQuestion();

    if (question[SConstants.HELP_DESCRIPTION]) {
      return (
        <HelpIcon
          absolutePosition={false}
          overlayPlacement="left"
          text={JsonLdUtils.getLocalized(question[SConstants.HELP_DESCRIPTION], this.context.options.intl)}
          iconClassContainer="help-icon-section"
        />
      );
    }

    return null;
  }

  _renderSwitch() {

    const question = this.props.question;
    const showAdvancedQuestion = this._getShowAdvancedQuestion(question).question;
    const advancedQuestionLabel = JsonldUtils.getLocalized(showAdvancedQuestion[SConstants.RDFS_LABEL], this.context.options.intl);
    const switchState = this._getShowAdvancedState();

    return (
      <div className="show-advanced-switch" style={{float: 'right'}}>
        <Form.Switch
          onChange={this._toggleAdvanced}
          id={'--switch-' + showAdvancedQuestion['@id']}
          label={advancedQuestionLabel}
          checked={switchState}
          inline
        />

        {this._renderShowAdvancedHelp()}
      </div>
    )
  }

  render() {
    return this._renderSwitch();
  }
}

ShowAdvancedSwitch.contextType = ConfigurationContext;
