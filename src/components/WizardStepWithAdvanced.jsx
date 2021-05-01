import React from 'react';
import {WizardStep, Question, Constants as SConstants, HelpIcon, FormUtils} from 's-forms';
import {Card, Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import QuestionWithAdvanced from "./QuestionWithAdvanced";
import Utils from "../Utils";
import Constants from "../Constants";


export default class WizardStepWithAdvanced extends WizardStep {

  static mappingRule = q => {

    if (!FormUtils.isWizardStep(q)) {
      return false;
    }

    return Utils.hasSubQuestionWithValue(q, Constants.SHOW_ADVANCED_QUESTION, true);
  }

  _toggleAdvanced = (e) => {
    e.stopPropagation();

    let {question} = QuestionWithAdvanced.findShowAdvancedQuestion(this.props.step);

    let value = QuestionWithAdvanced.isShowAdvanced(question);

    question[SConstants.HAS_ANSWER] = [{}];
    question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {'@value': !value}
    question[SConstants.HAS_VALID_ANSWER] = true;

    this.onChange(this.props.stepIndex, this.props.step);
  };

  _renderShowAdvancedHelp() {
    const {question} = QuestionWithAdvanced.findShowAdvancedQuestion(this.props.step);

    if (question[SConstants.HELP_DESCRIPTION]) {
      return (
        <HelpIcon
          absolutePosition={false}
          overlayPlacement="left"
          text={JsonLdUtils.getLocalized(question[SConstants.HELP_DESCRIPTION], this.props.options.intl)}
          iconClassContainer="help-icon-section"
        />
      );
    }

    return null;
  }

  render() {

    const categoryClass = Question._getQuestionCategoryClass(this.props.step);

    const advancedQuestion = QuestionWithAdvanced.findShowAdvancedQuestion(this.props.step).question;
    const advancedQuestionLabel = JsonLdUtils.getLocalized(advancedQuestion[SConstants.RDFS_LABEL], this.props.options.intl);
    const showAdvancedState = QuestionWithAdvanced.isShowAdvanced(advancedQuestion);

    return (
      <div className="wizard-step">
        <Card className="wizard-step-content">
          <Card.Header className="bg-primary text-white" as="h6" id={this.props.step['@id']}>
            {JsonLdUtils.getLocalized(this.props.step[JsonLdUtils.RDFS_LABEL], this.props.options.intl)}
            {this._renderHelpIcon()}

            <div style={{float: 'right'}}>
              <Form.Switch
                onChange={this._toggleAdvanced}
                id={'--switch-' + this.props.step['@id']}
                label={advancedQuestionLabel}
                checked={showAdvancedState}
                inline
              />

              {this._renderShowAdvancedHelp()}
            </div>

          </Card.Header>
          <Card.Body className={categoryClass}>
            <QuestionWithAdvanced question={this.props.step} onChange={this.onChange} withoutCard={true}
                                  index={this.props.stepIndex}/>
          </Card.Body>
        </Card>

        {this.props.options.wizardStepButtons && this._renderWizardStepButtons()}
      </div>
    );

  }

}
