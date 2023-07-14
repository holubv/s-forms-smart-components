import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TypeQuestionAnswer } from "../s-forms-components";
import data from "./assets/data.json";
import { IntelligentTreeSelect } from "intelligent-tree-select";

export default {
  title: "Components/IntelligentTreeSelect",
  component: IntelligentTreeSelect,
} as ComponentMeta<typeof IntelligentTreeSelect>;

const Template: ComponentStory<typeof IntelligentTreeSelect> = (args) => {
  return (
    <IntelligentTreeSelect
      value={[]} //["http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-390/v-3000000"]}
      valueKey={"@id"}
      valueIsControlled={false}
      labelKey={"http://www.w3.org/2000/01/rdf-schema#label"}
      childrenKey={"subTerm"}
      simpleTreeData={true}
      options={data}
      displayInfoOnHover={true}
      onOptionCreate={(option) => {
        console.log("created", option);
      }}
    />
  );
};

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  options: { data },
};
