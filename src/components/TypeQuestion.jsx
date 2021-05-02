import React from 'react';
import {Card} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {Question, Constants as SConstants, FormUtils} from 's-forms';
import Constants from "../Constants";
import classNames from "classnames";
import TypeQuestionAnswer from "./TypeQuestionAnswer";

export default class TypeQuestion extends Question {

  static mappingRule = q => !FormUtils.isSection(q) && TypeQuestionAnswer.mappingRule(q);

  constructor(props) {
    super(props);
  }

  renderAnswers() {
    const question = this.props.question;
    const children = [];
    const answers = this._getAnswers();

    for (let i = 0, len = answers.length; i < len; i++) {

      let cls = classNames(
        'answer',
        Question._getQuestionCategoryClass(question),
        Question.getEmphasizedOnRelevantClass(question)
      );

      children.push(
        <div key={'row-item-' + i} className={cls} id={question['@id']}>
          <div className="answer-content type-answer" style={this._getAnswerWidthStyle()}>
            <TypeQuestionAnswer
              index={i}
              answer={answers[i]}
              question={question}
              onChange={this.onAnswerChange}
            />
          </div>
          {this._renderUnits()}
          {this._renderPrefixes()}
        </div>
      );
    }
    return children;
  }

}
