import React from 'react';
import {
  SearchBar,
  Button,
  Switch,
  WingBlank,
  Radio,
  Icon
} from 'antd-mobile';
import Base from '../Base';
import './style.less';

export default class Filter extends Base {
  showCalendar = () => {
    this.context.stores.coordination.calendar.show();
  }

  renderItem(config) {
    let Element;
    switch (config.constructor.name) {
    case 'FilterCheck':
      Element = (<Switch key={config.key} checked={config.checked} onClick={value => this.context.onEvent(config, 'change', {value})} />);
      break;
    case 'FilterSearch':
      Element = (<SearchBar key={config.key} placeholder={config.placeholder} />);
      break;
    case 'FilterRadio':
      Element = (<Radio key={config.key} className="my-radio" onChange={value => this.context.onEvent(config, 'change', {value})}>{config.text}</Radio>);
      break;
    case 'FilterCalendar':
      Element = (<Button key={config.key} inline size="small" onClick={this.showCalendar}>日期 <Icon type="down" size={'small'} /></Button>);
      break;
    default:
      Element = null;
    }
    return config.blank ?
      (<WingBlank key={config.key+'black'} size={config.blank}>
        {Element}
      </WingBlank>) :
      Element;
  }

  render() {
      const {
        config
      } = this.props;
      const {
        items
      } = config;
      if (!config.black){
        return  (<div className='filter'>
          {items.map(this.renderItem)}
         </div>);
      }
      return (<WingBlank className='filter' size={config.blank}>
        {items.map(this.renderItem)}
       </WingBlank>);
  }
}
