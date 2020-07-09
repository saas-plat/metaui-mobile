import React from 'react';
import {
  storiesOf
} from '@storybook/react';
import {
  action
} from '@storybook/addon-actions';
import {
  UIContainer,
  MetaUI,
  UIRender
} from '@saas-plat/metaui';
import {
  View
} from '@saas-plat/metaschema';
import dataAddon from '../.storybook/data/dataAddon';
import '../src';

const data = {}

const grouplist = MetaUI.create(View({
  name: 'table',
  type: 'table',

}), data).ui;

const detaillist = MetaUI.create(View({
  name: 'table',
  type: 'table',

}), data).ui;

const bar = MetaUI.create(View({
  type: 'chart',
  height: 300,
  width: '100%',
}), data).ui;

const pie = MetaUI.create(View({
  type: 'chart',
  height: 300,
  width: '100%',
}), data).ui;

const line = MetaUI.create(View({
  type: 'chart',
  height: 300,
  width: '100%',
}), data).ui;

storiesOf('展示类', module)
  .addParameters({
    data
  })
  .addDecorator(dataAddon)
  .add('GroupList', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
    <div className='full'>
      <UIRender ui={grouplist}/>
    </div>
    </UIContainer>)

  .add('DetailList', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={detaillist}/>
      </UIContainer>)

  .add('Chart', () => <UIContainer
    onEvent={(name,args)=>action(name)(args)}
    onAction={(name,args)=>action(name)(args)}>
      <UIRender ui={bar}/>
      <UIRender ui={pie}/>
      <UIRender ui={line}/>
    </UIContainer>)
