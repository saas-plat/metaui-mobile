import React from 'react';
import {
  useParameter,
  useAddonState,
  useChannel
} from '@storybook/api';

export default () => {
  const data = useParameter('data', null);
  const [state, setState] = useAddonState('changes', data);
  useChannel({
    'data/updateEvent': (data) => {
      setState(data);
    }
  });
  // if (!value){
  //   return null;
  // }
  // const updateData = () => {
  //   Object.keys(state).forEach(key => {
  //     value[key] = state[key];
  //   })
  // }
  // const saveChagne = e => {
  //   try {
  //     setState(JSON.parse(e.target.value))
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  //   onChange={saveChagne} onBlur={updateData}
  return <div style={{width:'100%',height:'100%'}}>
      <textarea style={{width:'100%',height:'100%',border: 'none',padding:0}} readOnly value={JSON.stringify(state, null, 4)}></textarea>
    </div>
}
