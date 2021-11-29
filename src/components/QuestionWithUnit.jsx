import React from 'react';
import { Question, Answer, Constants as SConstants, FormQuestionsContext } from 's-forms';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Constants from "../Constants";
import Utils from "../Utils";


class _QuestionWithUnit extends Question {

  constructor(props) {
    super(props);

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
    let unitId = question[Constants.HAS_UNIT_OF_MEASURE];
    if (unitId['@id']) {
      unitId = unitId['@id'];
    }

    const parent = Utils.findParent(this.props.formData.root, question['@id']);
    if (!parent) {
      return null;
    }

    const unitQuestion = Utils.findDirectChild(parent, unitId);
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
          <div className="base-question"
               onMouseEnter={this._onMouseEnterHandler}
               onMouseLeave={this._onMouseLeaveHandler}>
            <Answer
              index={0}
              answer={answers[0]}
              question={question}
              onChange={this.onAnswerChange}
              onCommentChange={this.onCommentChange}
              showIcon={this.state.showIcon}
            />
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
