# Scroller

Scroller用于提供模拟IOS滑动效果的容器, 支持以下特性:

* 带有滚动条
* 滚动过程中惯性效果
* 滚动到顶部/底部时回弹效果
* 滚动到顶部时下拉 **PullRefresh**
* 滚动到底部时上拉 **LoadMore**

Scroller 会根据当前的操作系统及版本自动选择最优的实现方式.



## 安装

##### 如果你想独立使用 Scroller, 直接安装包并在代码中引用即可

安装

```javascript
npm install chanjet-scroller
```
引用
```javascript
import {Scroller} from "chanjet-scroller"
```



##### 如果你正在使用 `chanjet-ui` 库, 那么你可以直接在 `chanjet-ui` 库中使用

```javascript
import Scroller from "chanjet-ui/lib/components/Scroller"
```



## 简单上手

如果你只是需要一个和IOS滚动效果类似的容器, 那么只需要使用Scroller包装你所需要显示的内容即可.

### 定义显示范围

由于Scroller是一个容器, 所以需要制定Scroller的宽高来定义内容区域的大小.  有三种方式可以定义大小:

* 通过外部容器进行控制

  ​	Scroller默认宽高均为100%, 所以可以通过外部容器进行大小控制;

* 通过 `displayHeight` , `displayWidth` 控制

  ​	Scroller接收 `displayHeight` ,  `displayWidth` 属性, 可以通过这两个属性进行控制;

* 通过style控制

  ​	Scroller接收style属性, 可以给最外层容器进行样式设置;

***注意: `style` 的优先级高于 `displayHeight` , `displayWidth`.***



```javascript
//react组件的render方法, 其余代码省略

//使用外部div进行控制
render(){
  return (
    <div style={{width:200, height:50}} >
      <Scroller>
      ...
      </Scroller>
    </div>
  );
}

...

//使用displayWidth, displayHeight进行控制
render(){
  return (
    <Scroller displayWidth={200} displayHeight={50}>
    ...
    </Scroller>
  );
}

...

//使用style进行控制
render(){
  return (
    <Scroller style={{width:200, height:50}}>
    ...
    </Scroller>
  );
}
```



## 顶部下拉刷新

### 启用

在 `props` 中通过 `refreshHandler` 可以设置回调函数并启用下拉刷新功能.

### 设置触发操作的高度

在 `props` 中通过 `distanceToRefresh` 可以设置触发刷新的高度, 默认值: 45



当用户滚动到顶部并且继续下拉超过指定高度( `distanceToRefresh` )后, 我们会认为用户想要刷新数据, `refreshHandler` 会当做刷新事件的响应函数被执行. 我们会传递一个执行完成的回调函数, 当做 `refreshHandler` 的第一个参数.

当外部数据处理完成或错误后, 执行这个回调来将顶部的loading状态重新设置会初始状态.



```javascript
import React from 'react';

class DemoPage extends React.Component{
  //回调接受第一个参数作为外部过程完成后的回调函数
  onRefresh(done){
    //这里使用Promise是为了表示,需要在外部业务处理完成后再调用回调的顺序关系
    Promise.resolve(() => {
      //具体更新数据代码, 省略
      ...
    }).then(() => {
      //刷新完数据后, 执行回调函数回复动画的初始状态
      done();
    });
  }

  //react组件的render方法
  render(){
    const onRefresh = (done) => {
      refreshData().then(done);
    }

    return (
      <Scroller
          //设置触发刷新的高度为60
          distanceToRefresh={60}
          //设置回调函数为onRefresh
          refreshHandler={this.onRefresh.bind(this)}
      >
        //具体内容省略
      	...
      </Scroller>
    );
  }
}

```



## 底部上拉加载更多

底部上拉加载更多的设置方式和顶部下拉刷新基本一致, 只不过属性值改为 `moreHandler` .

`distanceToRefresh` 设置的高度, 同时影响下拉刷新和上拉加载更多.



```javascript
import React from 'react';

class DemoPage extends React.Component{
  //回调接受第一个参数作为外部过程完成后的回调函数
  onLoadMore(done){
    //这里使用Promise是为了表示,需要在外部业务处理完成后再调用回调的顺序关系
    Promise.resolve(() => {
      //具体加载更多数据代码, 省略
      ...
    }).then(() => {
      //加载完数据后, 执行回调函数回复动画的初始状态
      done();
    });
  }

  //react组件的render方法
  render(){

    return (
      <Scroller
          //设置触发刷新的高度为60
          distanceToRefresh={60}
          //设置回调函数为onLoadMore
          moreHandler={this.onLoadMore.bind(this)}
      >
        //具体内容省略
      	...
      </Scroller>
    );
  }
}
```



## Props

| 属性                     | 类型               | 描述                                       | 默认值     |
| ---------------------- | ---------------- | ---------------------------------------- | ------- |
| refreshHandler         | function         | 触发顶部刷新时调用                                | -       |
| moreHandler            | function         | 触发底部加载时调用                                | -       |
| scrollHandler          | function         | 滚动时调用(在IOS环境下, 模拟滚动也会触发这个事件, 所以事件内的处理代码请谨慎使用. 可能会影响渲染性能) |         |
| refreshColor           | string           | 顶部刷新的图标的颜色                               |         |
| moreColor              | string           | 尾部加载的图标的颜色                               |         |
| displayWidth           | string or number | 容器显示宽度                                   | 100%    |
| displayHeight          | string or number | 容器显示高度                                   | 100%    |
| distanceToRefresh      | number           | 触发刷新和加载的高度,单位是像素                         | 45      |
| rootBackgroundColor    | string           | 设置最底层背景色                                 | #F5F5F5 |
| contentBackgroundColor | string           | 设置内容区域背景颜色                               | #FFFFFF |

