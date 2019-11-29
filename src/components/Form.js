import React from 'react';
import {
  observer
} from "mobx-react";
import PropTypes from 'prop-types';
import {
  List
} from 'antd-mobile';
import {
  createForm
} from 'rc-form';
import Input from './Input';
import ScrollView from 'saas-plat-mobfx/dist/components/ScrollView';

@createForm()
@observer
export default class Edit extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
  }

  renderList(list, value) {
    return (
      <List renderHeader={() => list.headerText} key={list.key}>
        {list.items.map(input => (<Input key={input.key} config={input} value={value} form={this.props.form}></Input>))}
      </List>
    );
  }

  render() {
    const {
      config,
      value
    } = this.props;
    const {
      state
    } = config; // readonly
    return (
      <ScrollView className='form'>
        {config.items.map((list) => this.renderList(list,value))}
      </ScrollView>
    );
  }
}
