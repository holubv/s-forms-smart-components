import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import { Card, Accordion } from 'react-bootstrap';
import {Question, FormUtils, Constants as SConstants, Answer, ConfigurationContext} from 's-forms';
import Constants from "../Constants";
import classNames from 'classnames';
import SmartComponents from "../SmartComponents";
import ShowAdvancedSwitch from "./ShowAdvancedSwitch";
import TypeQuestionAnswer from "./TypeQuestionAnswer";
import SectionIdentifier from "./SectionIdentifier";

export default class SectionComponent extends Question {

  static mappingRule = q => FormUtils.isSection(q) && !FormUtils.isWizardStep(q);

  constructor(props) {
    super(props);

    const toggleCollapseSuper = this._toggleCollapse;
    this._toggleCollapse = (e) => {
      let classList = e.target.classList;
      if (!classList.contains('answer-content') && !classList.contains('card-header')) {
        return;
      }
      toggleCollapseSuper();
    }
  }

  _renderIdentifierText() {
    return (
      <SectionIdentifier
        question={this.props.question}
        prefix="("
        suffix=")"
      />
    );
  }

  _renderShowAdvanced() {
    const question = this.props.question;

    if (!ShowAdvancedSwitch.mappingRule(question)) {
      return null;
    }

    return (
      <ShowAdvancedSwitch {...this.props} />
    );
  }

  _renderQuestionHelp() {
    return (
      <>
        {super._renderQuestionHelp()}
        {this._renderIdentifierText()}
        {this._renderShowAdvanced()}
      </>
    );
  }

  _renderAnswer(index, answer) {
    const question = this.props.question;

    let component = Answer;

    if (TypeQuestionAnswer.mappingRule(question)) {
      component = TypeQuestionAnswer;
    }

    return React.createElement(component, {
      index: index,
      answer: answer,
      question: question,
      onChange: this.onAnswerChange,
      onSubChange: this.onSubQuestionChange,
      isInSectionHeader: true
    });
  }

  _getAnswerWidthStyle() {
    if (TypeQuestionAnswer.mappingRule(this.props.question)) {
      return {
        maxWidth: 'none'
      }
    }

    return super._getAnswerWidthStyle();
  }

  renderAnswers() {
    const question = this.props.question,
      children = [],
      answers = this._getAnswers();
    let cls;
    let isTextarea;

    for (let i = 0, len = answers.length; i < len; i++) {
      isTextarea =
        FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
        FormUtils.isSparqlInput(question) ||
        FormUtils.isTurtleInput(question);
      cls = classNames(
        'answer',
        Question._getQuestionCategoryClass(question),
        Question.getEmphasizedOnRelevantClass(question)
      );
      children.push(
        <div key={'row-item-' + i} className={cls} id={question['@id']}>
          <div className="answer-content" style={this._getAnswerWidthStyle()}>
            {this._renderAnswer(i, answers[i])}
            {this._renderIdentifierText()}
          </div>
          {this._renderUnits()}
          {this._renderPrefixes()}


          {this._renderShowAdvanced()}
        </div>
      );
    }
    return children;
  }

  _getSubQuestions() {
    const sub = super._getSubQuestions();

    return sub;
  }

}

SectionComponent.contextType = ConfigurationContext;
