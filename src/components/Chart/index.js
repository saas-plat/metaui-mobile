import React from 'react';
import {
  ActivityIndicator
} from 'antd-mobile';
import Base from '../Base';
import './style.less';
import {
  topx
} from './util';
const style = require('!less-to-json-loader!./style.less');

const loadEchart = (cb) => {
  require.ensure([], require => {
    cb(require('./Echart').default);
  }, 'echart');
}

export default class Chart extends Base {

  constructor() {
    super();
    loadEchart((Echart) => {
      this.setState({
        Echart
      })
    })
  }

  getOption() {
    const {
      config
    } = this.props;
    //柱状图数据
    const barOption = {
      color: [style['brand-primary']], // todo 这里的颜色需要充default.less中取@brand-primary
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: 'xxxx',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }]
    };

    return barOption;
  }

  onChartClick = () => {
    this.context.onEvent(this.props.config, 'click');
  }

  onChartReadyCallback = () => {
    this.context.onEvent(this.props.config, 'ready');
  }

  render() {
    const {
      config
    } = this.props;
    return (<div className='chart'>
         <ActivityIndicator toast animating={!this.state.Echart}/>
          {this.state.Echart?<this.state.Echart
            option={this.getOption()}
            style={{height:topx(config.height), width: topx(config.width)}}
            // notMerge={true}
            // lazyUpdate={true}
            //theme="my_theme"
            onChartReady={this.onChartReadyCallback}
            onEvents={{
              click: this.onChartClick,
            }}
            opts={{renderer: 'svg'}}/>:null}
      </div>);
  }
}
