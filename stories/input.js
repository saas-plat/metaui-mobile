import React from 'react';
import {
  storiesOf
} from '@storybook/react';
import {
  action
} from '@storybook/addon-actions';
import {
  UIRender,
  UIContainer,
  MetaUI,
} from '@saas-plat/metaui';
import {
  View
} from '@saas-plat/metaschema';
import {
  observable
} from "mobx";
import '../src';
import dataAddon from '../.storybook/data/dataAddon';
import './style.less';
import i18next from 'i18next';
import {
  initReactI18next
} from 'react-i18next';
i18next.use(initReactI18next).init();

const store = new MetaUI();
const data = observable({
  text: 'AAAAAAAAA',
  date: new Date(),
  dates: [new Date(), new Date()],
  time: new Date(),
  number: 10000.33,
  bool: true,
  obj: {
    b: 'BBBBBBBB',
    c: new Date(),
    a: 1000000.55,
  },
  objs: [],
  refobjs: [{
    a: 1,
    b: '1111111111',
    c: new Date()
  }, {
    a: 20.11,
    b: '222222',
    c: new Date()
  }],
  selectes: [1, 2, 3, 4, 100, 1000000.11].map(v => ({
    value: v,
    text: v.toString()
  })),
  tree: [{
    title: 'Root',
    value: 100,
    children: [{
      title: 'a-1',
      value: 10,
      children: [{
        title: 'a-1-1',
        value: 90
      }]
    }, {
      title: 'a-2',
      b: 200
    }]
  }]
});
store.setModel(data);


const textbox = store.build(MetaUI.loadModel(View({
  type: 'text',
  value: '$text',
  setValue: 'text',
  label: 'text',
  icon: 'form',
  tip: 'xxxxxxxxxxxxx',
  error: 'xxxxxxxxx',
  required: true
}).root));
const intstring = store.build(MetaUI.loadModel(View({
  type: 'text',
  value: '$text',
  setValue: 'text',
  label: 'text',
  icon: 'form',
  format: 'intstring',
  tip: 'xxxxxxxxxxxxx',
  required: true
}).root));
const password = store.build(MetaUI.loadModel(View({
  type: 'text',
  value: '$text',
  setValue: 'text',
  label: 'text',
  icon: 'form',
  format: 'password',
  tip: 'xxxxxxxxxxxxx',
  required: true
}).root));
const textarea = store.build(MetaUI.loadModel(View({
  type: 'textarea',
  value: '$text',
  setValue: 'text',
  icon: 'form',
  tip: 'xxxxxxxxxxxxx',
  required: true
}).root));

const datetime = store.build(MetaUI.loadModel(View({
  type: 'datetime',
  value: '$date',
  setValue: 'date',
  required: true,
  extra: 'xxxxxxxxxxxxx'
}).root));

const time = store.build(MetaUI.loadModel(View({
  type: 'time',
  value: '$date',
  setValue: 'date',
  text: 'time'
}).root));

const date = store.build(MetaUI.loadModel(View({
  type: 'date',
  value: '$date',
  setValue: 'date',
  required: true,
  extra: 'xxxxxxxxxxxxx'
}).root));

const month = store.build(MetaUI.loadModel(View({
  type: 'month',
  value: '$date',
  setValue: 'date',
  text: 'time'
}).root));

const week = store.build(MetaUI.loadModel(View({
  type: 'week',
  value: '$date',
  setValue: 'date',
  text: 'time'
}).root));

const daterange = store.build(MetaUI.loadModel(View({
  type: 'daterange',
  value: '$dates',
  setValue: 'dates',
  text: 'time'
}).root));

const number = store.build(MetaUI.loadModel(View({
  type: 'number',
  value: '$number',
  setValue: 'number',
  text: 'number'
}).root));

const thousandth = store.build(MetaUI.loadModel(View({
  type: 'number',
  value: '$number',
  setValue: 'number',
  format: 'thousandth',
  text: 'number'
}).root));

const percentage = store.build(MetaUI.loadModel(View({
  type: 'number',
  value: '$number',
  setValue: 'number',
  format: 'percentage',
  text: 'number'
}).root));

const check = store.build(MetaUI.loadModel(View({
  type: 'check',
  value: '$bool',
  setValue: 'bool',
  text: 'check'
}).root));
const switch1 = store.build(MetaUI.loadModel(View({
  type: 'switch',
  value: '$bool',
  setValue: 'bool',
  text: 'check'
}).root));



const multipleselect = store.build(MetaUI.loadModel(View({
  name: 'treesel',
  type: 'select',
  dropdownStyle: 'tree',
  value: '$number',
  setValue: 'number',
  dataSource: '$tree',
  multiple: true,

}).root));

const reflist = store.build(MetaUI.loadModel(View({
  name: 'item2',
  type: 'refer',
  displayField: 'b',
  value: '$obj',
  setValue: 'obj',
  dropdownStyle: 'list',
  multiple: false,
  showSearch: false,
  label: 'xxxxxxx',
  link: true,
  required: true,
  dataSource: '$refobjs',
  onFocus: {
    name: 'query',
    query: '=obj1{a,b,c,d,e}',
    variables: '{pid:$id}', // 去掉查询变量一次取出全部
    idField: 'id',
    pidField: 'pid',
    sortField: 'f1', // 树形全部取回来需要按照树结构排序
    mapping: '={f1:$a,f2:$b,f3:$c}',
    pageSize: 200
  },
  buttons: [{
    type: 'button',
    text: 'add',
    style: 'primary'
  }]
}).root));

const reftablemultiple = store.build(MetaUI.loadModel(View({
  name: 'item4',
  type: 'refer',
  displayField: 'b',
  dropdownStyle: 'table',
  label: 'xxxxxxx',
  //text: 'Aggs.sum($objs,"a")',   // 要是有text没有displayField，就显示一个text
  value: '$objs', // multiple: true,   是一个数组
  setValue: 'objs',
  multiple: true,
  dataSource: '$refobjs',
  onFocus: {
    name: 'query',
    query: '=obj1{id,pid,a,b,c,d,e}',
    variables: '{pid:$id}',
    mapping: '={f1:$a,f2:$b,f3:$c}',
    idField: 'id',
    pidField: 'pid'
  },
  //leafField: 'leaf',
  columns: [{
    title: 'aaa',
    dataIndex: 'a'
  }, {
    title: 'bbb',
    dataIndex: 'b'
  }, {
    title: 'ccc',
    dataIndex: 'c'
  }]
}).root));

// treetable和table带tree是不一样的，tree和table是不同的数据结构
const reftable = store.build(MetaUI.loadModel(View({
  name: 'item6',
  type: 'refer',
  label: 'xxxxxxx',
  dropdownStyle: 'treetable', // TODO 暂时未支持
  displayField: 'b',
  value: '$obj',
  setValue: 'obj',
  multiple: false,
  dataSource: '$refobjs',
  onFocus: {
    name: 'query',
    query: '=tree{id,pid,a,b,c,d,e}',
    dariables: '{pid:$tree.id}',
    idField: 'id',
    pidField: 'pid',
    sortField: 'a',
  },
  treeDisplayField: 'a',
  treeSelectable: 'leaf', // leaf parent all
  onTreeChange: {
    name: 'query',
    query: '=obj{a,b,c,d,e}',
    variables: '{tid:$tree.id}',
    mapping: '={f1:$a,f2:$b,f3:$c}',
  },
  columns: [{
    title: 'aaa',
    dataIndex: 'a'
  }, {
    title: 'bbb',
    dataIndex: 'b'
  }, {
    title: 'ccc',
    dataIndex: 'c'
  }, {
    title: 'ddd',
    dataIndex: 'd'
  }],
  buttons: [{
    type: 'button',
    text: 'add',
    style: 'primary'
  }, {
    type: 'select',
    value: '左模糊匹配',
    dataSource: [{
      value: 'let',
      text: '左模糊匹配'
    }, {
      value: 'right',
      text: '右模糊匹配'
    }]
  }]
}).root));

const subtable = store.build(MetaUI.loadModel(View({
  name: 'subtable',
  type: 'subtable',
  dataSource: '$refobjs',
  value: 'Aggs.sum($refobjs,"a")',
  columns: [{
    type: 'text',
    title: 'aaa',
    dataIndex: 'a'
  }, {
    type: 'text',
    title: 'bbb',
    dataIndex: 'b'
  }, {
    type: 'text',
    title: 'ccc',
    dataIndex: 'c'
  }, {
    type: 'text',
    title: 'ddd',
    dataIndex: 'd'
  }],
  buttons: {
    type: 'view',
    layout: 'right',
    items: [{
      type: 'button',
      icon: 'plus',
      style: 'link'
    }, {
      type: 'button',
      icon: 'search',
      style: 'link'
    }, {
      type: 'button',
      icon: 'search',
      style: 'link'
    }, {
      type: 'button',
      icon: 'search',
      style: 'link'
    }]
  }
}).root));

const edittable = store.build(MetaUI.loadModel(View({
  name: 'subtable',
  type: 'edittable',
  dataSource: '$refobjs',
  columns: [{
    type: 'number',
    title: 'aaa',
    dataIndex: 'a',
    width: 200
  }, {
    type: 'text',
    title: 'bbb',
    dataIndex: 'b',
    width: 200
  }, {
    type: 'date',
    title: 'ccc',
    dataIndex: 'c',
    width: 300
  }, {
    type: 'refer',
    title: 'ddd',
    dataIndex: 'd'
  }],
  buttons: [{
    type: 'button',
    text: 'add',
    style: 'primary'
  }, {
    type: 'button',
    text: 'delete'
  }, {
    type: 'button',
    text: 'Button3'
  }, {
    type: 'button',
    text: 'Button4'
  }]
}).root));

storiesOf('输入类', module)
  .addParameters({
    data
  })
  .addDecorator(dataAddon)

  .add('TextBox', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={textbox}/>
      <UIRender ui={intstring}/>
      <UIRender ui={password}/>
      <UIRender ui={textarea}/>
    </UIContainer>)
  .add('DatePicker', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={datetime}/>
      <UIRender ui={time}/>
      <UIRender ui={date}/>
      <UIRender ui={month}/>
      <UIRender ui={week}/>
      <UIRender ui={daterange}/>
    </UIContainer>)

  .add('NumberInput', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={number}/>
      <UIRender ui={thousandth}/>
      <UIRender ui={percentage}/>
    </UIContainer>)
  .add('CheckBox', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={check}/>
      <UIRender ui={switch1}/>
    </UIContainer>)

  .add('Select', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
    <UIRender ui={multipleselect}/>
    </UIContainer>)

  .add('Refer', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={reflist}/>
      <UIRender ui={reftable}/>
      <UIRender ui={reftablemultiple}/>
    </UIContainer>)

  .add('InputTable', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={subtable}/>
    </UIContainer>)

  // .add('EditTable', () => <UIContainer
  //   onEvent={(name,args)=>action(name)(args)}
  //   onAction={(name,args)=>action(name)(args)}>
  //     <UIRender ui={edittable}/>
  //   </UIContainer>)
