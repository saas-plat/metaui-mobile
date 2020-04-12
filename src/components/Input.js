import React from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {
  InputItem
} from 'antd-mobile';
import Base from './Base';

@observer
export default class Input extends Base {

  static propTypes = {
    form: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
  }

  render() {
    const {
      config
    } = this.props;
    // const {
    //   getFieldProps
    // } = this.props.form;
    const moneyProps = config.type === 'money' ? {
      normalize: (v, prev) => {
        if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
          if (v === '.') {
            return '0.';
          }
          return prev;
        }
        return v;
      }
    } : {};
    const formProps = {}; // getFieldProps(config.name);
    return (<InputItem
        key={config.key}
        {...formProps}
        {...moneyProps }
        type={config.type}
        placeholder={config.placeholder}
        clear={config.clear}
        editable={config.editable}
        disabled={config.disabled}
        maxLength={config.maxLength}
        labelNumber={config.labelNumber}
        defaultValue={config.defaultValue}
        value={config.value}
        onChange={(value)=>this.context.onEvent(config, 'change', {value})}
        onBlur={()=>this.context.onEvent(config, 'blur')}
        onFocus={()=>this.context.onEvent(config, 'focus')}
      >{config.text}</InputItem>);
  }
}
