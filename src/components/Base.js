import React from 'react';
import PropTypes from 'prop-types';

export default class Base extends React.Component{
  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  static contextTypes = {
    viewModel: PropTypes.object.isRequired,
    stores: PropTypes.object.isRequired,
    onEvent: PropTypes.func.isRequired,
  }

  state = {}

}
