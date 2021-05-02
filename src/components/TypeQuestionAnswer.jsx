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
import Utils from "../Utils";

export default class TypeQuestionAnswer extends React.Component {

  static mappingRule = q => JsonLdUtils.hasValue(q, SConstants.LAYOUT_CLASS, Constants.LAYOUT_TYPE_QUESTION);

  constructor(props) {
    super(props);

    this.state = {
      // tree: [
      //   {id: '1', value: '1', label: 'One', children: ['1-1', '1-2']},
      //   {id: '1-1', value: '1-1', label: 'One One', children: []},
      //   {id: '1-2', value: '1-2', label: 'One Two', children: []},
      //   {id: '2', value: '2', label: 'Two', children: []},
      // ],
      tree: {},
      selected: [],
      update: 0
    }
  }

  _onChange = value => {
    console.log(value);

    //console.log(JsonLdObjectMap.objectMap);
    //console.log(JsonLdObjectMap.getObject('x:zvire'));

    const change = {...this.props.answer};

    change[SConstants.HAS_DATA_VALUE] = {
      '@value': !!(value && value.length)
    };

    this.setState({
      selected: value,
      tree: this._checkDisjointOptions(this.state.tree, value),
      update: this.state.update + 1
    });

    // const tree = this.state.tree;
    // tree[1].checked = false;
    // tree[1].disabled = true;
    // this.setState({tree: tree});

    this.props.onChange(this.props.index, change);
  }

  _checkDisjointOptions(tree, selected) {

    for (let o of Object.values(tree)) {
      o.disabled = false;
    }

    if (selected === undefined) {
      selected = this.state.selected;
    }

    if (selected) {
      for (let selectedOption of selected) {
        for (let d of selectedOption.disjoint) {
          tree[d].disabled = true;
        }
      }
    }

    return tree;
  }

  _isRegenerationNeeded(previousQuestion) {
    if (!Object.values(this.state.tree).length) {
      return true;
    }
    const question = this.props.question;
    return !Utils.hasArraySameValues(previousQuestion[SConstants.HAS_OPTION], question[SConstants.HAS_OPTION]);
  }

  _generateOptions() {
    console.log('generating tree...');
    const question = this.props.question;
    const possibleValues = question[SConstants.HAS_OPTION];
    if (!possibleValues || !possibleValues.length) {
      return [];
    }

    const objects = possibleValues
      .map(id => {
        let def = JsonLdObjectMap.getObject(id);
        if (!def) {
          console.warn('cannot find object ' + id);
          return null;
        }
        return def;
      })
      .filter(o => o !== null);

    const options = {};
    const relations = [];

    for (let def of objects) {

      let label = JsonLdUtils.getLocalized(def[SConstants.RDFS_LABEL], this.context.options.intl);

      options[def['@id']] = {
        value: def['@id'],
        label: label,
        children: [],
        disjoint: []
      };

      if (def[Constants.DISJOINT_WITH]) {
        let disjoints = def[Constants.DISJOINT_WITH];

        if (disjoints.length === undefined) {
          // only single disjoint without array
          disjoints = [disjoints];
        }

        for (let disjoint of disjoints) {
          relations.push({
            type: 'disjoint',
            a: disjoint['@id'],
            b: def['@id']
          });
        }
      }

      if (def[Constants.BROADER]) {
        relations.push({
          type: 'parent-child',
          parent: def[Constants.BROADER]['@id'],
          child: def['@id']
        });
      }
    }

    for (let relation of relations) {

      if (relation.type === 'parent-child') {
        options[relation.parent].children.push(relation.child);
      }

      if (relation.type === 'disjoint') {
        options[relation.a].disjoint.push(relation.b);
        options[relation.b].disjoint.push(relation.a);
      }
    }

    this._checkDisjointOptions(options);

    console.log(options);

    this.setState({
      tree: options,
      update: this.state.update + 1
    });
  }

  _renderSelect() {

    if (!Object.values(this.state.tree).length) {
      return null;
    }

    return (
      <VirtualizedTreeSelect
        value={this.state.selected}
        valueKey="value"
        labelKey="label"
        childrenKey="children"
        options={Object.values(this.state.tree)}
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

  componentDidMount() {
    this._generateOptions();
  }

  componentDidUpdate(prevProps) {
    if (this._isRegenerationNeeded(prevProps.question)) {
      console.log('regeneration needed');
      this._generateOptions();
    }

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
