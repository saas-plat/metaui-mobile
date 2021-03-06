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

import '../src';
import './style.less';

const navbar = MetaUI.create(View({
  type: 'navbar',
  text: 'this is title',
  items: [{
    name: 'search',
    icon: 'search',
    text: '过滤',
    onClick: 'search'
  },{
    name: 'add',
    icon: 'plus',
    text: '新增',
    onClick: 'add'
  },{
    name: 'edit',
    //icon: 'search',
    text: '修改',
    onClick: 'edit'
  },{
    name: 'delete',
    icon: 'delete',
    text: '删除',
    onClick: 'delete'
  }]
}), {}).ui;

storiesOf('输入类', module)
  .add('Navbar', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={navbar}/>
    </UIContainer>)
