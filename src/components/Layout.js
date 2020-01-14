import React from 'react';
import {
  observer
} from "mobx-react";
import PropTypes from 'prop-types';
import {
  List
} from 'antd-mobile';
import ScrollView from './ScrollView';
import Base from './Base';

@observer
export default class Layout extends Base {
  static propTypes = {
    form: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
  }

  renderList(list, value) {
    return (
      <List renderHeader={() => list.headerText} key={list.key}>
        {list.items.map(input => this.renderItem(input,{value,form:this.props.form}))}
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
