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
import {
  ContainerModel
} from '@saas-plat/metaui';

@observer
export default class Layout extends Base {
  static propTypes = {
    // form: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    // value: PropTypes.object.isRequired,
  }

  renderList(list, value) {
    if (list instanceof ContainerModel) {
      return (<List renderHeader={() => list.headerText} key={list.key}>
        {list.items.map(input => this.renderItem(input,{value }))}
      </List>);
    } else {
      return this.renderItem(list, {
        value
      });
    }
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
      <ScrollView className='layout'>
        {config.items.map((list) => this.renderList(list,value))}
      </ScrollView>
    );
  }
}
