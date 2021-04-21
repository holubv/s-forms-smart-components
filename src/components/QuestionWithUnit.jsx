import React from 'react';
import { Question, Answer, Constants as SConstants, FormQuestionsContext } from 's-forms';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Constants from "../Constants";


class _QuestionWithUnit extends Question {

  constructor(props) {
    super(props);

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

  static _findParent(root, id) {

    const subQuestions = root[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {

      for (const subQuestion of subQuestions) {

        if (subQuestion['@id'] === id) {
          return root;
        }

        const found = _QuestionWithUnit._findParent(subQuestion, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  static _findDirectChild(parent, id) {
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

  _onUnitQuestionChange = (index, change) => {
    // pass change to the parent
    this.props.onChange(index, change);
  }

  renderAnswers() {

    if (!this.props.formData) {
      return null;
    }

    const question = this.props.question;
    const unitId = question[Constants.HAS_UNIT_OF_MEASURE];

    const parent = _QuestionWithUnit._findParent(this.props.formData.root, question['@id']);
    if (!parent) {
      return null;
    }

    const unitQuestion = _QuestionWithUnit._findDirectChild(parent, unitId);
    if (!unitQuestion) {
      console.error('question with unit: cannot find question ' + unitId);
      return null;
    }

    const answers = this._getAnswers();
    const cls = classNames(
      Question._getQuestionCategoryClass(question),
      'answer'
    );

    return [
      <div key={'row-item-0'} className={cls} id={question['@id']}>
        <div className="question-with-unit">
          <div className="base-question">
            <Answer index={0} answer={answers[0]} question={question} onChange={this.onAnswerChange} />
            {this._renderUnits()}
            {this._renderPrefixes()}
          </div>

          <div className="unit-question">
            <Question question={unitQuestion.q} onChange={this._onUnitQuestionChange} index={unitQuestion.index}/>
          </div>
        </div>
      </div>
    ];
  }

}

_QuestionWithUnit.propTypes.formData = PropTypes.object;

const QuestionWithUnit = (props) => {

  const formQuestionsContext = React.useContext(FormQuestionsContext);
  const formData = formQuestionsContext.getData();

  return (
    <_QuestionWithUnit formData={formData} {...props} />
  );
};

export default QuestionWithUnit;
