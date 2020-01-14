/**
 * 模拟滚动条, 解决在部分安卓上DIV不显示滚动条的问题
 *
 * Created by TonyJiang on 16/4/3.
 */
import React from 'react'
import PropTypes from 'prop-types';

function getStyles(props , state){

    let toggleTime = state.show ? 250 : 500;

    return {
        root : {
            //spacing
            position:'absolute',
            right:1,
            // top:state.outerDeltaY,
            top: 0,
            bottom:0,
            width:'0.05rem', //2px
            opacity : state.show ? 1 : 0,
            zIndex : 3,

            borderRadius : '0.05rem', //2px
            pointerEvents : 'none',
            transitionProperty : 'opacity',
            transitionDuration : toggleTime + 'ms'
        },

        content : {
            position:'absolute',
            top: 0,
            width:'100%' ,
            height : state.height,
            borderRadius : 2,
            backgroundColor : 'grey',
            transitionDuration : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            transform : 'translate3d(0px , ' + state.top + 'px , 0px)',
            //兼容 老版本 ios <8.3 , safari动画兼容性问题. 使用webkit前缀
            WebkitTransform : 'translate3d(0px , ' + state.top + 'px , 0px)'
        }
    }

}

class ScrollBar extends React.Component{

    static propTypes = {
        show : PropTypes.bool
    }

    static defaultProps = {
        show : false
    }

    state = {
        deltaY : 0 ,
        top: 0,
        height : '0%',
        show : false,
        press : false
    }

    componentWillUnmount(){
        //组件被销毁时, 清除掉hide的timeout
        clearTimeout(this._hideTimer);
    }

    show(){
        this.setState({show : true , press : true});
    }

    hide(){
        this._hide(50);
    }

    scrollTo(scrollData){
        this._deltaYChange(scrollData);
    }

    _deltaYChange(newData){
        const {deltaY , contentHeight , clientHeight} = newData;

        const height =Math.abs(Math.max(Math.min(clientHeight / contentHeight , 1) * clientHeight , 40));

        //当前y轴百分比
        let percent = deltaY / (contentHeight - clientHeight);
        //调整当前视窗追加高度 , 随着高度增加 , y轴适当向下调整 , 直到100%时 , y轴基准位置变成窗口底部
        percent = (deltaY + percent*clientHeight) /contentHeight;

        const top = Math.abs( percent * (clientHeight - height));

        this._updateScrollBar(0 , top , height);

    }

    _updateScrollBar(deltaY , top , height , ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)' , duration = 0){

        this.refs.content.style.height = height + 'px';
        this.refs.content.style['transition-duration'] = this.refs.content.style['-webkit-transition-duration'] = duration + 'ms';
        this.refs.content.style['transition-timing-function'] = this.refs.content.style['-webkit-transition-timing-function'] = ease;
        this.refs.content.style.transform = this.refs.content.style['-webkit-transform'] = 'translate3d(0px ,'+top+'px , 0px)';

    }

    _hide(duration){
        // console.log('scrollbar hide in',duration , 'ms');
        clearTimeout(this._hideTimer);
        this._hideTimer = setTimeout(()=>{
            // console.log('延迟隐藏, 触发');
            this.setState({show : false});
        } , duration);
    }


    render(){

        const styles = getStyles(this.props , this.state);

        return (
            <div style={styles.root}>
                <div ref="content"  style={styles.content}></div>
            </div>
        );


    }

}

export default ScrollBar;
