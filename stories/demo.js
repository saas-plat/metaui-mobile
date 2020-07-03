import React from 'react';
import {
  storiesOf
} from '@storybook/react';
import {
  action
} from '@storybook/addon-actions';
import {
  registerApi,
  UIContainer,
  MetaUI,
  UIRender
} from '@saas-plat/metaui';
import i18n from 'i18next';
import '../src';

i18n.init()

registerApi({
  i18n
})

const data = {
  code: '',
  item1: 'AAAAAAAAA',
  obj2: {
    f1: 'BBBBBBBB',
    f2: new Date(),
    f3: 1000000.55,
  },
  objarr: [{
    a: 1
  }, {
    a: 20.11
  }],
  array1: [1, 2, 3, 4, 100, 1000000.11]
};

const report = MetaUI.create({
  type: 'view',
  items:[{
     type: 'navbar',
     text: 'this is title',
     items: [{
       name: 'search',
       icon: 'search',
       text: '过滤',
       onClick: 'search'
     }]
   }, {
     type: 'chart',
     tabs: {
       items: [{
         name: 'item1',
         text: '供应商',
         scroll: true,
         filter:{
           type: 'search'
         },
         total:[{
           text: '总收入',
           title: '1000,000.00'
         },{
           text: '税额',
           title: '$summary[1]'
         },{
           text: '毛利',
           title: '$summary[2]'
         },{
           text: '周转率',
           title: '$summary[3]'
         }],
         chart:{
           type:'bar'
         },
         detail:{

         }
       }, {
         name: 'item2',
         text: '供应商分类'
       }, {
         name: 'item3',
         text: '存货'
       }, {
         name: 'item4',
         text: '存货分类'
       }]
     }
   }]
}, data)

const voucher = MetaUI.create({
  type: 'view',
  layout: 'vertical',
  items: [{
    type: 'text',
    value: 'code',
    text: 'code',
    icon: 'form',
    tip: 'xxxxxxxxxxxxx',
    rules: [{
      required: true
    }]
  }]
}, data)

storiesOf('示例', module)
  .addParameters({
    data
  })
  .add('Archive', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('Refer', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('Voucher', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('EditList', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('Search', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('VoucherList', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('ArchiveList', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={voucher}/>
      </UIContainer>)
  .add('Report', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={report}/>
      </UIContainer>)
