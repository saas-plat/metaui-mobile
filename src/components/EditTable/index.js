import React from 'react';
import PropTypes from 'prop-types';
import Base from '../Base';
import './style.less';

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/1.png',
    title: '相约酒店',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/1.png',
    title: '麦当劳邀您过周末',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/1.png',
    title: '食惠周',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
let index = data.length - 1;

let pageIndex = 0;

export default class EditTable extends Base{
  static contextTypes = {
    onLoadMore: PropTypes.func,
    onRefresh: PropTypes.func,
  }

  constructor(props, context) {
    super(props);

    this.state = {
      //dataSource: dataSource.cloneWithRows(this.initData),
      refreshing: false,
    };

    context.onLoadMore(this.onEndReached);
    context.onRefresh(this.onRefresh);
  }

  onRefresh=()=>{

  }

  onEndReached = () => {
    if (this.state.isLoading  ) {
     return;
   }
    this.setState({ isLoading : true });
    setTimeout(() => {
      this.initData = [`ref${pageIndex++}`, ...this.initData];
      this.setState({
        //dataSource: this.state.dataSource.cloneWithRows(this.initData),
        isLoading : false,
      });
    }, 1000);
  };

  render() {
    const {config} = this.props;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (obj, sectionID, rowID) => {
      // if (index < 0) {
      //   index = data.length - 1;
      // }
      // const obj = data[index--];
      return (
        <div key={rowID}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',
          }}
        >
          <h3 style={{ padding: 2, marginBottom: '0.08rem', borderBottom: '1px solid #F6F6F6' }}>
            {obj.title}
          </h3>
          <div style={{ display: '-webkit-box', display: 'flex' }}>
            <img style={{ height: '1.28rem', marginRight: '0.08rem' }} src={obj.img} />
            <div style={{ display: 'inline-block' }}>
              <p>{obj.des}-{rowID}</p>
              <p><span style={{ fontSize: '1.6em', color: '#FF6E27' }}>35</span>元/任务</p>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
        {data.map((it,id)=>{
          return row(it, '', id)
        })}
      </div>
    );
  }
}
