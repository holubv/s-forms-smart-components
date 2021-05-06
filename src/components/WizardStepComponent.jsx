import React from 'react';
import {WizardStep, Question, Constants as SConstants, HelpIcon, FormUtils, FormQuestionsContext} from 's-forms';
import {Card, Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import ShowAdvancedSwitch from "./ShowAdvancedSwitch";
import Utils from "../Utils";
import Constants from "../Constants";
import SectionIdentifier from "./SectionIdentifier";


export default class WizardStepComponent extends WizardStep {

  static mappingRule = q => FormUtils.isWizardStep(q);

  _renderIdentifierText() {
    return (
      <SectionIdentifier question={this.props.step} />
    );
  }

  _renderShowAdvanced() {
    const question = this.props.step;

    if (!ShowAdvancedSwitch.mappingRule(question)) {
      return null;
    }

    return (
      <ShowAdvancedSwitch
        question={this.props.step}
        onChange={this.onChange}
        index={this.props.stepIndex}
      />
    );
  }

  render() {

    const categoryClass = Question._getQuestionCategoryClass(this.props.step);

    return (
      <div className="wizard-step">
        <Card className="wizard-step-content">
          <Card.Header className="bg-primary text-white" as="h6" id={this.props.step['@id']}>
            {JsonLdUtils.getLocalized(this.props.step[JsonLdUtils.RDFS_LABEL], this.props.options.intl)}
            {this._renderHelpIcon()}

            {this._renderIdentifierText()}
            {this._renderShowAdvanced()}

          </Card.Header>
          <Card.Body className={categoryClass}>
            <Question question={this.props.step} onChange={this.onChange} withoutCard={true}
                                  index={this.props.stepIndex}/>
          </Card.Body>
        </Card>

        {this.props.options.wizardStepButtons && this._renderWizardStepButtons()}
      </div>
    );

  }

}

WizardStepComponent.contextType = FormQuestionsContext;
