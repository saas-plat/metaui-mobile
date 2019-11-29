import React from 'react';
import Base from './Base';
import Filter from './Filter';
import Total from './Total';
import Chart from './Chart';
import DetailList from './DetailList';

// 组合体，根据配置显示多个组件
export default class Composer extends Base {
  render() {
    const {
      config,
      className
    } = this.props;
    return (
      <div className={className}>
        {config.map(it => {
          if (it.constructor.name === 'Filter') {
            return <Filter key={it.key} config={it}/>;
          }
          if (it.constructor.name === 'Total') {
            return <Total key={it.key} config={it}/>;
          }
          if (it.constructor.name === 'Chart') {
            return <Chart key={it.key} config={it}/>;
          }
          if (it.constructor.name === 'DetailList') {
            return <DetailList key={it.key} config={it}/>;
          }
        })}
       </div>
    );
  }
}
