/**
 * Created by TonyJiang on 16/3/30.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as prefixer from 'inline-style-prefixer';

// import SVGNavigationArrowDownward from '../../svg-icons/navigation/arrow-downward';
// import RefreshIndicator from '../../RefreshIndicator';

import LoadingIcon from "./LoadingIcon";
import ArrowIcon from "./ArrowIcon";

import {
  px2px,
  px2rem
} from './pixel';

import {
  TYPE,
  STATUS,
  REFRESH_STATUS_LABEL,
  DIRECTION
} from './constant';

function getStyles(props, state) {

  // const beforeRotateStyle = props.direction == DIRECTION.UP ? 'rotateZ(180deg)' : 'rotateZ(0deg)';
  // const afterRotateStyle = props.direction == DIRECTION.UP ? 'rotateZ(0deg)' : 'rotateZ(180deg)';

  const firstTranslateStyle = 'translate(-' + (props.deltaPercent * 45) + 'px)';
  const endTranslateStyle = 'translate(' + (props.deltaPercent * 45) + 'px)';

  const styles = {
    root: Object.assign({
      display: props.enable ? 'block' : 'none',
      position: 'relative',
      left: 0,
      width: '100%',
      height: '1.2rem', //40px,
      // lineHeight: '1.2rem' , //40px
      color: props.color,
      textAlign: 'center'
    }, props.style || {}),

    iconWrapper: {
      display: 'flex',
      display: '-webkit-flex',
      justifyContent: 'center',
      WebkitJustifyContent: 'center',
      paddingTop: px2rem(10),
      paddingBottom: px2rem(10)
    },

    arrowIcon: {
      width: '0.8rem', //30px,
      height: '0.8rem', //30,
      color: props.color,
      display: state.status === STATUS.DOING ? 'none' : '',
      transformOrigin: 'center',
      transitionDuration: '400ms',
      WebkitTransitionDuration: '400ms',
      // transitionDuration : '0ms',
      // WebkitTransitionDuration : '0ms',
      // transform : state.status == STATUS.TRIGGER ? afterRotateStyle : beforeRotateStyle,
      // WebkitTransform : state.status == STATUS.TRIGGER ? afterRotateStyle : beforeRotateStyle
      first: {
        transform: firstTranslateStyle,
        WebkitTransform: firstTranslateStyle
      },
      end: {
        transform: endTranslateStyle,
        WebkitTransform: endTranslateStyle
      }
    },

    loadingIcon: {
      width: '0.8rem', //30px,
      height: '0.8rem', //30,
      color: props.color,
      display: state.status === STATUS.DOING ? '' : 'none'

    }

  };

  const prefixStyles = prefixer.prefix(styles);

  return prefixStyles;
}

class Refresher extends React.Component {

  static TYPE = TYPE;

  static STATUS = STATUS;

  static STATUS_LABEL = REFRESH_STATUS_LABEL;

  static propTypes = {
    enable: PropTypes.bool,
    type: PropTypes.oneOf([TYPE.ICON, TYPE.LABEL]),
    statusLabel: PropTypes.object,
    distanceToRefresh: PropTypes.number,
    direction: PropTypes.oneOf([DIRECTION.DOWN, DIRECTION.UP]),
    status: PropTypes.oneOf([STATUS.INITIAL, STATUS.TRIGGER, STATUS.DOING, STATUS.DONE]),
    color: PropTypes.string,

    requestData: PropTypes.func,
    watcher: PropTypes.func,

    deltaPercent: PropTypes.number,
  };

  static defaultProps = {
    enable: true,
    type: TYPE.ICON,
    statusLabel: REFRESH_STATUS_LABEL,
    distanceToRefresh: px2px(45 * 2, true),
    direction: DIRECTION.DOWN,
    status: STATUS.INITIAL,
    color: "black",
    deltaPercent: 0,

    requestData: () => {},
    watcher: () => {}
  };

  state = {
    status: STATUS.INITIAL,
    show: false
  };

  //目前refresher所有操作都不通过props或者state进行控制,避免VirtualList刷新时频繁导致Refresher render
  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {

    this._initDomRefs();

  }

  componentDidMount() {
    //ReactDOM.findDOMNode(this.refs.loadingIcon).style['-webkit-animation'] = 'chanjet_wrapper_circle 1s infinite linear';
    // this.refs.loadingIcon.style['-webkit-animation'] = 'chanjet_wrapper_circle 1s infinite linear';
  }

  updateStyle(deltaPercent) {

    deltaPercent = deltaPercent>1?1:deltaPercent;

    const firstTranslateStyle = 'translate(-' + (deltaPercent * 45) + 'px)';
    const endTranslateStyle = 'translate(' + (deltaPercent * 45) + 'px)';

    const arrowIcon = ReactDOM.findDOMNode(this.refs.arrowIcon);

    arrowIcon.children['first'].style['transform'] = arrowIcon.children['first'].style['-webkit-transform'] = firstTranslateStyle,
      arrowIcon.children['end'].style['transform'] = arrowIcon.children['end'].style['-webkit-transform'] = endTranslateStyle;

  }

  updateStatus(status) {

    // const beforeRotateStyle = this.props.direction == DIRECTION.UP ? 'rotateZ(180deg)' : 'rotateZ(0deg)';
    // const afterRotateStyle = this.props.direction == DIRECTION.UP ? 'rotateZ(0deg)' : 'rotateZ(180deg)';

    const loadingIcon = ReactDOM.findDOMNode(this.refs.loadingIcon);
    const arrowIcon = ReactDOM.findDOMNode(this.refs.arrowIcon);

    this.state.status = status;

    switch (status) {
    case STATUS.INITIAL:

      //arrowIcon.style['transform'] = arrowIcon.style['-webkit-transform'] = beforeRotateStyle;

      loadingIcon.style.display = 'none';
      arrowIcon.style.display = 'block';

      break;

    case STATUS.TRIGGER:

      //arrowIcon.style['transform'] = arrowIcon.style['-webkit-transform'] = afterRotateStyle;

      loadingIcon.style.display = 'none';
      arrowIcon.style.display = 'block';

      break;

    case STATUS.DOING:

      loadingIcon.style.display = 'block';
      arrowIcon.style.display = 'none';

      break;

    }

    // this.setState({status : status});
  }

  _initDomRefs() {
    this.domRefs = {
      arrowIcon: ReactDOM.findDOMNode(this.refs.arrowIcon)
    };
  }

  render() {
    // console.log('refresher.render' , this.state.status);

    const styles = getStyles(this.props, this.state);

    // const icon = (
    //     <div style={styles.iconWrapper}>
    //         <RefreshIndicator
    //             ref="loadingIcon"
    //             status="loading"
    //             size={px2rem(60)}
    //             loadingColor={styles.loadingIcon.color}
    //             style={styles.loadingIcon}
    //         />
    //         <SVGNavigationArrowDownward
    //             ref="arrowIcon"
    //             color={styles.arrowIcon.color}
    //             style={styles.arrowIcon}
    //         />
    //     </div>
    //
    // );

    // const animation = <style>
    //     {`
    //         @-webkit-keyframes chanjet_wrapper_circle{
    //             0%{ -webkit-transform:rotate(0deg); }
    //             100%{ -webkit-transform:rotate(360deg); }
    //         }
    //     `}
    // </style>;

    //{animation}
    const icon = (
      <div style={styles.iconWrapper}>
                <LoadingIcon
                    ref="loadingIcon"
                    loadingColor={styles.loadingIcon.color}
                    style={styles.loadingIcon}
                />
                <ArrowIcon
                    ref="arrowIcon"
                    color={styles.arrowIcon.color}
                    style={styles.arrowIcon}
                />
            </div>

    );

    const label = <label ref="refreshLabel">{this.props.statusLabel[this.state.status]}</label>;

    const content = this.props.type == TYPE.ICON ? icon : label;

    return (
      <div ref="refresh" style={styles.root}>
                {content}
            </div>
    );
  }

}

export default Refresher;
