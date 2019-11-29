import React from 'react';
import { Tabs } from 'antd-mobile';
import PropTypes from 'prop-types';
import Composer from '../Composer';
import ScrollView from 'saas-plat-mobfx/dist/components/ScrollView';
import './style.less';

export default class TabPage extends React.Component{
  static propTypes = {
    config: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
  }

  subscribeLoadMores=[];
  subscribeRefreshs=[];

  static childContextTypes = {
    onLoadMore: PropTypes.func,
    onRefresh: PropTypes.func,
  }

  getChildContext() {
    return {
      onLoadMore: this.subscribeLoadMore,
      onRefresh: this.subscribeRefresh
    };
  }

  subscribeLoadMore=(handler)=>{
    this.subscribeLoadMores.push(handler);
  }

  subscribeRefresh=(handler)=>{
    this.subscribeRefreshs.push(handler);
  }

  loadMore=(done)=>{
    Promise.all(this.subscribeLoadMores).then(done);
  }

  refresh = (done)=>{
    Promise.all(this.subscribeRefreshs).then(done);
  }

  renderPanel(tab){
    if (tab.scroll === true) {
      return (<ScrollView key={tab.key} moreHandler={this.loadMore} refreshHandler={this.refresh}>
          <Composer className='panel' config={tab.items}/>
        </ScrollView>);
    }
    return (<Composer key={tab.key} className='panel' config={tab.items}/>);
  }

  renderTab(tabs){
    if (tabs.items.length === 1){
      return this.renderPanel(tabs.items[0]);
    }
    return (<Tabs page={tabs.page}
    tabBarPosition={tabs.tabBarPosition}
    initialPage={tabs.initialPage}
    swipeable={tabs.swipeable}
    useOnPan={tabs.useOnPan}
    animated={tabs.animated}
    usePaged={tabs.usePaged}
    tabDirection={tabs.tabDirection}
    tabs={tabs.items}
     renderTabBar={props => (<Tabs.DefaultTabBar {...props}  />)}>
      {tabs.items.map(tab=>{
        return this.renderPanel(tab);
      })}
    </Tabs>);
  }

  render() {
    const {config} = this.props;
    return (<div className='tabs'>
      {this.renderTab(config)}
    </div>);
  }
}
