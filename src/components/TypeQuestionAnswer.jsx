import React from 'react';
import {Accordion, Card, Form, FormGroup} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {
  Question,
  FormUtils,
  Constants as SConstants,
  HelpIcon,
  Answer,
  ConfigurationContext,
  JsonLdObjectMap
} from 's-forms';
import Constants from "../Constants";
import SmartComponents from "../SmartComponents";
import PropTypes from "prop-types";
import {VirtualizedTreeSelect} from "intelligent-tree-select";

export default class TypeQuestionAnswer extends React.Component {

  static mappingRule = q => JsonLdUtils.hasValue(q, SConstants.LAYOUT_CLASS, Constants.LAYOUT_TYPE_QUESTION);

  constructor(props) {
    super(props);

    this.state = {
      tree: [
        {id: '1', value: '1', label: 'One', children: ['1-1', '1-2']},
        {id: '1-1', value: '1-1', label: 'One One', children: []},
        {id: '1-2', value: '1-2', label: 'One Two', children: []},
        {id: '2', value: '2', label: 'Two', children: []},
      ],
      selected: null
    }
  }

  _onChange = value => {
    console.log(value);

    //console.log(JsonLdObjectMap.getObject('x:zvire'));

    const change = { ...this.props.answer };

    change[SConstants.HAS_DATA_VALUE] = {
      '@value': !!(value && value.length)
    };

    this.setState({selected: value});
    this.props.onChange(this.props.index, change);
  }

  _renderSelect() {

    return (
      <VirtualizedTreeSelect
        value={this.state.selected}
        valueKey="value"
        labelKey="label"
        childrenKey="children"
        options={this.state.tree}
        expanded={true}
        closeOnSelect={false}
        onChange={this._onChange}
        // onChange={opt => {
        //   console.log(opt);
        //   this.setState({selected: opt.map(o => o.value).filter(v => v !== '1-1')});
        //
        //   const tree = this.state.tree;
        //   tree[1].checked = false;
        //   tree[1].disabled = true;
        //   this.setState({tree: tree});
        // }}
        multi={true}
      />
    );

  }

  _renderLabel() {
    const label = JsonLdUtils.getLocalized(this.props.question[SConstants.RDFS_LABEL], this.context.options.intl);
    return <Form.Label>{label}</Form.Label>;
  }

  render() {
    return (
      <div className="type-answer-group">
        {this._renderLabel()}
        {this._renderSelect()}
      </div>
    )
  }

}

TypeQuestionAnswer.contextType = ConfigurationContext;

TypeQuestionAnswer.propTypes = {
  index: PropTypes.number.isRequired,
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}
