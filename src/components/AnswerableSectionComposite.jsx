import React from 'react';
import {Question, FormUtils, Constants as SConstants, Answer, ConfigurationContext} from 's-forms';
import Constants from "../Constants";
import classNames from 'classnames';
import SmartComponents from "../SmartComponents";
import QuestionWithAdvanced from "./QuestionWithAdvanced";
import TypeQuestionAnswer from "./TypeQuestionAnswer";

export default class AnswerableSectionComposite extends Question {

  static mappingRule = q => FormUtils.isSection(q) && FormUtils.isAnswerable(q);

  constructor(props) {
    super(props);
  }

  _renderShowAdvanced() {
    const question = this.props.question;

    if (!QuestionWithAdvanced.mappingRule(question)) {
      return null;
    }

    return (
      <QuestionWithAdvanced
        {...this.props}
        switchOnly={true}
      />
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
      onChange: this.onAnswerChange
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
