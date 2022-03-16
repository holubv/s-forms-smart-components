import React, { useRef, useState } from "react";
import SForms, { Constants } from "s-forms";
import SmartComponents from "../SmartComponents";
import exampleForm from "./assets/example_form.json";
import exampleFormTC from "./assets/example_turisticky_cil.json";
import possibleValues from "./assets/possibleValues.json";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const componentMapping = SmartComponents.getComponentMapping();

const modalProps = {
  onHide: () => {},
  show: true,
  title: "Title",
};

const options = {
  i18n: {
    "wizard.next": "Next",
    "wizard.previous": "Previous",
    "section.expand": "Expand",
    "section.collapse": "Collapse",
  },
  intl: {
    locale: "cs",
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  startingStep: 1,
  users: [
    { id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart" },
    {
      id: "http://fel.cvut.cz/people/miroslav-blasko",
      label: "Miroslav Blasko",
    },
  ],
  currentUser: "http://fel.cvut.cz/people/max-chopart",
  icons: [
    {
      id: Constants.ICONS.QUESTION_HELP,
      behavior: Constants.ICON_BEHAVIOR.ENABLE,
    },
    {
      id: Constants.ICONS.QUESTION_COMMENTS,
      behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
    },
    {
      id: Constants.ICONS.QUESTION_LINK,
      behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
    },
  ],
};

export default {
  title: "SForms Smart Component",
  component: SForms,
} as ComponentMeta<typeof SForms>;

const Template: ComponentStory<typeof SForms> = (args) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<object>(exampleForm);
  const refForm = useRef();

  const fetchTypeAheadValues = (query) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
    <SForms
      options={options}
      componentMapping={componentMapping}
      form={selectedForm}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  options: options,
};
export const AdvancedComponents = Template.bind({});
AdvancedComponents.args = {
  options: options,
  form: exampleFormTC,
};
