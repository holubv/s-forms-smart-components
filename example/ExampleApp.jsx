import React from 'react';
import ReactDOM from 'react-dom';
import SForms from 's-forms';
import SmartComponents from "../src/SmartComponents";

import 's-forms/css/s-forms.min.css';
import '../src/styles/components.css';
import 'react-datepicker/dist/react-datepicker.css';
import "intelligent-tree-select/lib/styles.css"

const componentMapping = SmartComponents.getComponentMapping();

const exampleForm = require('./example_form.json');
const exampleFormTC = require('./example_turisticky_cil.json');

const modalProps = {
  onHide: () => {
  },
  show: true,
  title: 'Title'
};

const options = {
  i18n: {
    'wizard.next': 'Next',
    'wizard.previous': 'Previous',
    'section.expand': 'Expand',
    'section.collapse': 'Collapse'
  },
  intl: {
    locale: 'cs'
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  startingStep: 1
};

class ExampleApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormValid: false,
      selectedForm: exampleForm
    };
    this.refForm = React.createRef();
  }

  fetchTypeAheadValues = (query) => {
    const possibleValues = require('./possibleValues.json');
    return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
  };

  render() {
    return (
      <div className="p-4">
        <SForms
          ref={this.refForm}
          form={this.state.selectedForm}
          options={options}
          fetchTypeAheadValues={this.fetchTypeAheadValues}
          isFormValid={(isFormValid) => this.setState({isFormValid})}
          componentMapRules={componentMapping}
        />
        <div>
          Second form demonstrates show advanced switch and sections with answer.
          Use the switch form button bellow to switch between individual forms.
        </div>
        <button
          disabled={!this.state.isFormValid}
          style={{width: '100px', margin: '8px 16px', position: 'relative', left: '50%'}}
          onClick={() => {
            this.setState((prevState) => (
              {selectedForm: prevState.selectedForm === exampleFormTC ? exampleForm : exampleFormTC}
            ));
          }}
        >
          Switch form
        </button>
      </div>

    );
  }
}

ReactDOM.render(<ExampleApp/>, document.getElementById('container'));
