import React from 'react';
import {Accordion, Card, Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {Question, FormUtils, Constants as SConstants, HelpIcon, Answer, ConfigurationContext} from 's-forms';
import Constants from "../Constants";
import classNames from 'classnames';
import JsonldUtils from 'jsonld-utils';

export default class QuestionWithAdvanced extends Question {

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

    this.state.showAdvanced = this._getShowAdvancedState();
  }

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(SConstants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  componentDidMount() {
    super.componentDidMount();

    let {index, question} = this._getShowAdvancedQuestion();
    if (question[SConstants.LAYOUT_CLASS] !== SConstants.LAYOUT.HIDDEN) {
      question[SConstants.LAYOUT_CLASS] = SConstants.LAYOUT.HIDDEN;
      this._onChange(SConstants.HAS_SUBQUESTION, index, question);
    }
  }

  _getShowAdvancedQuestion() {
    return QuestionWithAdvanced.findShowAdvancedQuestion(this.props.question);
  }

  _getShowAdvancedState() {
    let {question} = this._getShowAdvancedQuestion();
    return QuestionWithAdvanced.isShowAdvanced(question);
  }

  _toggleAdvanced = (e) => {
    e.stopPropagation();

    let {index, question} = this._getShowAdvancedQuestion();

    let value = this._getShowAdvancedState();

    question[SConstants.HAS_ANSWER] = [{}];
    question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {'@value': !value}
    question[SConstants.HAS_VALID_ANSWER] = true;

    this.state.showAdvanced = !value;

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

    return (
      <div className="show-advanced-switch" style={{float: 'right'}}>
        <Form.Switch
          onChange={this._toggleAdvanced}
          id={'--switch-' + showAdvancedQuestion['@id']}
          label={advancedQuestionLabel}
          checked={this.state.showAdvanced}
          inline
        />

        {this._renderShowAdvancedHelp()}
      </div>
    )
  }

  render() {
    const question = this.props.question;

    if (FormUtils.isHidden(question)) {
      return null;
    }

    if (!FormUtils.isRelevant(question)) {
      return null;
    }

    const {collapsible, withoutCard} = this.props;
    const categoryClass = Question._getQuestionCategoryClass(question);

    if (withoutCard) {
      return <div>{this._renderQuestionContent()}</div>;
    }
    const label = JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], this.context.options.intl);

    const headerClassName = classNames(
      FormUtils.isEmphasised(question) ? Question.getEmphasizedClass(question) : 'bg-info',
      collapsible ? 'cursor-pointer' : '',
      this.state.expanded ? 'section-expanded' : 'section-collapsed'
    );

    if (FormUtils.isAnswerable(question)) {
      return this.renderAnswerableSection();
    }

    const cardBody = (
      <Card.Body className={classNames('p-3', categoryClass)}>{this._renderQuestionContent()}</Card.Body>
    );

    return (
      <Accordion defaultActiveKey={!this.state.expanded ? label : undefined}>
        <Card className="mb-3">
          <Accordion.Toggle as={Card.Header} onClick={this._toggleCollapse} className={headerClassName}>
            <h6 className="d-inline" id={question['@id']}>
              {collapsible && this._renderCollapseToggle()}
              {label}
            </h6>

            {this._renderQuestionHelp()}

            {this._renderSwitch()}

          </Accordion.Toggle>
          {collapsible ? <Accordion.Collapse>{cardBody}</Accordion.Collapse> : {cardBody}}

        </Card>
      </Accordion>
    );
  }

  renderAnswers() {
    const question = this.props.question;

    if (!FormUtils.isAnswerable(question)) {
      return super.renderAnswers();
    }

    const answer = this._getAnswers()[0];

    let isTextarea =
      FormUtils.isTextarea(question, FormUtils.resolveValue(answer)) ||
      FormUtils.isSparqlInput(question) ||
      FormUtils.isTurtleInput(question);
    let cls = classNames(Question._getAnswerClass(question, isTextarea), Question._getQuestionCategoryClass(question));

    return [(
      <div className="row" key={'question-row-0'}>
        <div key={'row-item-0'} className={cls} id={question['@id']}>
          <div className="row">
            <div className="col-10">
              <Answer index={0} answer={answer} question={question} onChange={this.onAnswerChange}/>
            </div>
            <div>
              {this._renderUnits()}
              {this._renderQuestionHelp()}
              {this._renderPrefixes()}
            </div>
          </div>
        </div>
        {this._renderSwitch()}
      </div>
    )];
  }

}

QuestionWithAdvanced.contextType = ConfigurationContext;
