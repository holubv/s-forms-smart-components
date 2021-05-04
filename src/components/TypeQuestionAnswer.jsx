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
      singleSelect: false,
      update: 0
    }
  }

  _onChange = value => {

    if (!value) {
      value = [];
    }

    if (value.length === undefined) {
      value = [value];
    }

    console.log(value);

    this._setAnswers(value);

    const change = {...this.props.answer};

    change[SConstants.HAS_DATA_VALUE] = {
      '@value': !!(value && value.length)
    };

    if (!this.state.singleSelect) {
      this.setState({tree: this._checkDisjointOptions(this.state.tree, value)});
    }

    this.setState({
      selected: value,
      update: this.state.update + 1
    });

    this.props.onChange(this.props.index, change);
  }

  _setAnswers(answers) {

    let typeQuestions = this._findTypeQuestions();

    for (let i = 0; i < typeQuestions.length; i++) {
      const typeQuestion = typeQuestions[i].question;
      const answer = answers[i];

      if (answer) {
        typeQuestion[SConstants.HAS_ANSWER] = [{
          [SConstants.HAS_DATA_VALUE]: {
            '@value': answer.value
          }
        }];
      } else {
        typeQuestion[SConstants.HAS_ANSWER] = [];
      }

      this.props.onSubChange(typeQuestions[i].index, typeQuestion);
    }
  }

  _loadAnswers(options) {

    let values = [];
    let typeQuestions = this._findTypeQuestions();

    for (let typeQuestion of typeQuestions) {
      let question = typeQuestion.question;
      let answer = question[SConstants.HAS_ANSWER];
      if (answer && answer.length) {
        answer = answer[0];

        if (answer[SConstants.HAS_DATA_VALUE]) {
          values.push(answer[SConstants.HAS_DATA_VALUE]['@value']);
        }
      }
    }

    return values.map(id => options[id]).filter(v => !!v);
  }

  _findTypeQuestions() {
    const question = this.props.question;
    const ids = question[Constants.HAS_TYPE_QUESTION];
    const subQuestions = question[SConstants.HAS_SUBQUESTION];
    const typeQuestions = [];

    for (let i = 0; i < subQuestions.length; i++) {
      const subQuestion = subQuestions[i];
      if (ids.includes(subQuestion['@id'])) {
        typeQuestions.push({
          index: i,
          question: subQuestion
        });
      }
    }

    return typeQuestions;
  }

  _getMaxNumberOfAnswers() {
    const question = this.props.question;
    const typeQuestions = question[Constants.HAS_TYPE_QUESTION];
    if (!typeQuestions) {
      return 0;
    }

    if (Array.isArray(typeQuestions)) {
      return typeQuestions.length;
    }

    return 1;
  }

  _checkMaxNumberOfAnswers(tree, selected) {
    const maxAnswerCount = this._getMaxNumberOfAnswers();

    selected = selected.map(o => o.value);

    if (selected.length >= maxAnswerCount) {
      for (let o of Object.values(tree)) {
        if (!selected.includes(o.value)) {
          o.disabled = true;
        }
      }
    }
  }

  _checkNonSelectableOptions(tree) {
    const question = this.props.question;

    for (let o of Object.values(tree)) {
      if (JsonLdUtils.hasValue(question, Constants.HAS_NON_SELECTABLE_VALUE, o.value)) {
        o.disabled = true;
      }
    }
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
          if (tree[d]) {
            tree[d].disabled = true;
          }
        }
      }

      this._checkMaxNumberOfAnswers(tree, selected);
    }

    this._checkNonSelectableOptions(tree);

    return tree;
  }

  _isTotalDisjoint(tree) {

    const options = Object.values(tree);

    for (let option of options) {
      if (options.length - 1 !== option.disjoint.length) {
        return false;
      }
    }

    return true;
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

    const pushDisjoint = (a, b) => {
      if (!options[a].disjoint.includes(b)) {
        options[a].disjoint.push(b);
      }
    }

    for (let relation of relations) {

      if (relation.type === 'parent-child') {
        options[relation.parent]?.children.push(relation.child);
      }

      if (relation.type === 'disjoint') {
        if (options[relation.a] && options[relation.b]) {
          pushDisjoint(relation.a, relation.b);
          pushDisjoint(relation.b, relation.a);
        }
      }
    }

    const answers = this._loadAnswers(options);

    let totalDisjoint = this._isTotalDisjoint(options);

    if (this._getMaxNumberOfAnswers() <= 1) {
      // single answer allowed
      totalDisjoint = true;
    }

    if (!totalDisjoint) {
      this._checkDisjointOptions(options, answers);
    }

    this._checkNonSelectableOptions(options);

    console.log(options);

    this.setState({
      tree: options,
      singleSelect: totalDisjoint,
      update: this.state.update + 1,
      selected: answers
    });
  }

  _renderSelect() {

    if (!Object.values(this.state.tree).length) {
      return null;
    }

    let selectedValue = this.state.selected;
    if (this.state.singleSelect) {
      selectedValue = selectedValue?.[0];
    }

    return (
      <VirtualizedTreeSelect
        value={selectedValue}
        valueKey="value"
        labelKey="label"
        childrenKey="children"
        options={Object.values(this.state.tree)}
        expanded={true}
        closeOnSelect={this.state.singleSelect}
        onChange={this._onChange}
        multi={!this.state.singleSelect}
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

    if (this.props.isInSectionHeader) {
      return (
        <div className="type-answer-group">
          {this._renderLabel()}
          {this._renderSelect()}
        </div>
      );
    }

    return (
      <FormGroup>
        {this._renderLabel()}
        {this._renderSelect()}
      </FormGroup>
    );
  }

}

TypeQuestionAnswer.contextType = ConfigurationContext;

TypeQuestionAnswer.propTypes = {
  index: PropTypes.number.isRequired,
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubChange: PropTypes.func.isRequired,
  isInSectionHeader: PropTypes.bool
}
