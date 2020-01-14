import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class ScrollToTop extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  constructor(props, context) {
    super(props, context);
    this._handleScroll = this._handleScroll.bind(this);
  }

  componentDidMount() {
    this.ScrollPage.addEventListener('scroll', this._handleScroll);
  }

  componentWillUnMount() {
    this.ScrollPage.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll(e) {
    if (!this.goTop) {
      return;
    }
    if (e.target.scrollTop > 500) {
      this.goTop.style.display = 'block'
    } else {
      this.goTop.style.display = 'none'
    }
  }

  goTopClick = (e) => {
    e.preventEvent();
    this.ScrollPage.scrollTop = 0;
  }

  render() {
    return (<div className="scrollgotop" ref={ref=>this.ScrollPage=ref}>
               {this.props.children}
               <div ref={ref=>this.goTop=ref} onClick={this.goTopClick} className='go-top-btn'>
                 <span className="chanjet-icon-icon_zhiding" style={{fontSize:'20px'}}></span>
               </div>
            </div>);
  }
}
