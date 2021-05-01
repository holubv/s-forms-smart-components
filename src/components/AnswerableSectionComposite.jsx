import React from 'react';
import {Accordion, Card, Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {Question, FormUtils, Constants as SConstants, HelpIcon, Answer, ConfigurationContext} from 's-forms';
import Constants from "../Constants";
import classNames from 'classnames';
import JsonldUtils from 'jsonld-utils';
import SmartComponents from "../SmartComponents";
import {QuestionWithAdvanced} from "../lib";

export default class AnswerableSectionComposite extends Question {

  constructor(props) {
    super(props);
  }

  _renderShowAdvanced() {
    const question = this.props.question;

    if (!SmartComponents._hasAdvancedQuestion(question)) {
      return null;
    }

    return (
      <QuestionWithAdvanced
        {...this.props}
        switchOnly={true}
      />
    );
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
            <Answer index={i} answer={answers[i]} question={question} onChange={this.onAnswerChange}/>
          </div>
          {this._renderUnits()}
          {this._renderPrefixes()}

          {this._renderShowAdvanced()}
        </div>
      );
    }
    return children;
  }

}

AnswerableSectionComposite.contextType = ConfigurationContext;
