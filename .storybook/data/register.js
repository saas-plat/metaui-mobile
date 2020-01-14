import * as React from 'react';
import addons from '@storybook/addons';
import {
  AddonPanel
} from '@storybook/components';
import DataPanel from './DataPanel';
export const PARAM_KEY = 'datapanel';
export const ADDON_ID = 'storybook/datapanel';
export const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, api => {
  addons.addPanel(PANEL_ID, {
    title: 'Data',
    render: ({
        active,
        key
      }) =>
      <AddonPanel key={key} active={active}>
        <DataPanel api={api} />
      </AddonPanel>,
    paramKey: PARAM_KEY,
  });
});
