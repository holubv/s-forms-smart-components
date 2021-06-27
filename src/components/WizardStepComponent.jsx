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

  constructor(props) {
    super(props);

    this.card = React.createRef();
    this.cardHeader = React.createRef();

    this.state = {
      headerFloating: false,
      headerWidth: 0,
      headerHeight: 0
    }
  }

  componentDidMount() {
    if (this._isSticky()) {
      window.addEventListener('scroll', this._handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _isSticky() {
    const question = this.props.step;
    return JsonLdUtils.hasValue(question, SConstants.LAYOUT_CLASS, Constants.LAYOUT_STICKY);
  }

  _handleScroll = () => {

    /**
     * @type {HTMLDivElement}
     */
    const card = this.card.current;
    /**
     * @type {HTMLHeadingElement}
     */
    const header = this.cardHeader.current;
    if (!card || !header) {
      return;
    }

    const box = card.getBoundingClientRect();

    if (box.top <= 0) {

      if (!this.state.headerFloating) {

        const headerBox = header.getBoundingClientRect();

        this.setState({
          headerFloating: true,
          headerWidth: headerBox.width,
          headerHeight: headerBox.height
        })
      }

    } else {

      if (this.state.headerFloating) {
        this.setState({
          headerFloating: false,
          headerWidth: 0,
          headerHeight: 0
        })
      }

    }
  }


  _renderIdentifierText() {
    return (
      <SectionIdentifier question={this.props.step}
                         prefix="("
                         suffix=")"
      />
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

    let headerClass = 'bg-primary text-white wizard-step-header';
    let headerStyle = null;

    if (this.state.headerFloating) {
      headerClass += ' floating';
      headerStyle = {
        width: this.state.headerWidth
      }
    }


    return (
      <div className="wizard-step">
        <Card ref={this.card} className="wizard-step-content" >
          <Card.Header ref={this.cardHeader}
                       className={headerClass}
                       style={headerStyle}
                       as="h6"
                       id={this.props.step['@id']}
          >
            {JsonLdUtils.getLocalized(this.props.step[JsonLdUtils.RDFS_LABEL], this.props.options.intl)}
            {this._renderHelpIcon()}

            {this._renderIdentifierText()}
            {this._renderShowAdvanced()}

          </Card.Header>
          <Card.Body className={categoryClass} style={{marginTop: this.state.headerHeight}}>
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
