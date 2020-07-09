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

const search = MetaUI.create(View({
  name: 'table',
  type: 'table',

}), data).ui;

storiesOf('输入类', module)
  .addParameters({
    data
  })
  .addDecorator(dataAddon)
  .add('Search', () => <UIContainer
      onEvent={(name,args)=>action(name)(args)}
      onAction={(name,args)=>action(name)(args)}>
        <UIRender ui={search}/>
      </UIContainer>)
