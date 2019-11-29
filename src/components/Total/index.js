import React from 'react';
import {
  Grid
} from 'antd-mobile';
import Base from '../Base';
import './style.less';

export default class Total extends Base {

  handleClick = (el) => {
    const {
      config
    } = this.props;
    this.context.onEvent(config, 'click', {
      item: el.item
    })
  }

  renderBlock = (el) => {
    return (<div key={el.item.key} className={["block", el.noBorder?'no-border':''].join(' ')}>
        <div className="title">{el.title}</div>
        {el.text?<div className="text">{el.text}</div>:null}
    </div>);
  }

  renderGrid(config) {
    const data = config.items.map((it, i) => ({
      title: it.title,
      text: it.type === 'small' ?
        undefined : it.text,
      item: it,
      noBorder: !(config.type === 'small' ? (i+1) % 4 : (i+1) % 2)
    }));
    return (<div className={['total', config.type].join(' ')}
        onClick={this.handleClick}>
        {data.map(this.renderBlock)}
      </div>);
  }

  render() {
    const {
      config
    } = this.props;
    return this.renderGrid(config);
  }
}
