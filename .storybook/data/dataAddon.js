import React from 'react';
import addons, {
  makeDecorator
} from '@storybook/addons';
import {
  autorun
} from "mobx";

export default makeDecorator({
  name: 'dataAddon',
  parameterName: 'data',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, {
    parameters
  }) => {
    const channel = addons.getChannel();

    autorun(() => {
      channel.emit('data/updateEvent', parameters);
    })
    return getStory(context);
  }
})
