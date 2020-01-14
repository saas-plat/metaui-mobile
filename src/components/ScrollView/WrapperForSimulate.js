/**
 * Created by TonyJiang on 16/3/29.
 */
import React from 'react'
import ReactDOM from 'react-dom'

import {STATUS, DIRECTION, SIDE} from './common/constant';
import {propTypes, defaultProps} from './common/props';

import Refresher from './common/Refresher';
import ScrollBar from './common/ScrollBar';

function getStyles(props) {

    const {displayWidth, displayHeight, refreshColor, moreColor, contentBackgroundColor, rootBackgroundColor} = props;

    const rootStyle = {
        position: 'relative',
        width: displayWidth,
        height: displayHeight,
        overflow: 'hidden',
        background: rootBackgroundColor
    };

    return {

        root: Object.assign({}, rootStyle, props.style || {}),

        refresh:{
            color: refreshColor
        },

        more: {
            color: moreColor
        },

        content: {
            position: 'absolute',
            top: 0,
            width: '100%',
            minHeight: '100%',
            zIndex: 2,
            background: contentBackgroundColor,
            overflowX: 'hidden',
            overflowY: 'auto',
            transitionDuration: '0ms',
            transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            transform: `translate3d(0px , ${props.deltaY}px , 0px)`
        },

        fixKeyboardJumpTop: {
            position: 'absolute',
            width: '100%',
            left: 0,
            top: '-1px',
            height: '2px',
            zIndex: -1,
            background: contentBackgroundColor
        },

        fixKeyboardJumpBottom: {
            position: 'absolute',
            width: '100%',
            left: 0,
            bottom: '-2px',
            height: '3px',
            zIndex: -1,
            background: contentBackgroundColor
        }

    }

}

const cubic = {

    //超出边界减速
    quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    //回弹曲线
    outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',

    //惯性曲线
    outCubic: 'cubic-bezier(0.165, 0.84, 0.44, 1)',


    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    easeFastOutBack: 'cubic-bezier(0.625, 0.3, 0.95, 0.245)',

    //常规曲线
    circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)'
};

const tools = {
    translateMatrixRE: /matrix(3d)?\((.+?)\)/,
    parseTranslateMatrix: function (translateString, position) {
        if (!translateString) {
            return {x: 0, y: 0, z: 0};
        }
        var matrix = translateString.match(this.translateMatrixRE);
        var is3D = matrix && matrix[1];
        if (matrix) {
            matrix = matrix[2].split(",");
            if (is3D === "3d")
                matrix = matrix.slice(12, 15);
            else {
                matrix.push(0);
                matrix = matrix.slice(4, 7);
            }
        } else {
            matrix = [0, 0, 0];
        }
        var result = {
            x: parseFloat(matrix[0]),
            y: parseFloat(matrix[1]),
            z: parseFloat(matrix[2])
        };
        if (position && result.hasOwnProperty(position)) {
            return result[position];
        }
        return result;
    }
}

/**
 *  列表组件
 *  实现以下功能:
 *      1.顶部下拉刷新
 *      2.尾部下拉加载更多
 *      3.支持手势惯性效果
 *      4.支持回弹效果
 *
 *  @extends React.Component
 */
class WrapperForSimulate extends React.Component {

    /**
     *@member props {JSONObject} 接受设置参数
     *@memberOf LoadMoreList.prototype
     */
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    state = {

        enable: {
            [SIDE.TOP]: false,
            [SIDE.BOTTOM]: false
        },

        reach: {
            [SIDE.TOP]: false,
            [SIDE.BOTTOM]: false
        },

        status: undefined,
        refreshSide: null,
    };


    _stateInShadow = {
        status: undefined
    };


    _state = {};

    //Y轴相关
    _deltaY = 0;
    _lastDeltaY = 0;
    _reachSideDeltaY = 0;

    //dom指针
    domRefs = {};

    //timer

    //检测当前窗口内容是否显示够一屏, 不够需要往回滚动
    _checkOutOfRangeTimer = 0;
    //计算速度
    _velocityTimer = 0;
    //模拟惯性滚动
    _durationEventTrigger = 0;

    constructor(props, context) {
        super(props, context);

        this._bindFunction();

    }


    //根据props中事件监听, 判断是否启用refresh和loadMore
    componentWillMount(){
        this._checkEnable(this.props);
    }

    //根据props中事件监听, 判断是否启用refresh和loadMore
    componentWillReceiveProps(newProps){
        this._checkEnable(newProps);
    }

    componentDidMount() {

        this._initDomRefs();
        this._bindEvents();
        this._initDynamicState();
        this._method.startCheckOutOfRangeTimer();


    }

    componentWillUnmount(){
        this._unbindEvents();
        this._method.stopCheckOutOfRangeTimer();

    }

    //重新渲染后,判断内容是否不够填满一屏,如果不够需要向上滚动
    componentDidUpdate() {

        //等待dom真正重新渲染完成
        window.requestAnimationFrame(()=> {

            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            if (contentHeight < clientHeight) {
                return;
            }

            const computeScrollTop = contentHeight - clientHeight;

            if (computeScrollTop < Math.abs(this._deltaY) && this.state.status != STATUS.DOING) {
                this._deltaY = -computeScrollTop;
                this._method.scrollTo(0, this._deltaY);

            }
        });

    }

    _bindFunction() {
        this._eventHandler.dragStart = this._eventHandler.dragStart.bind(this);
        this._eventHandler.dragMove = this._eventHandler.dragMove.bind(this);
        this._eventHandler.dragEnd = this._eventHandler.dragEnd.bind(this);
    }

    _checkEnable(props){
        this.state.enable[SIDE.TOP] = props.hasOwnProperty('refreshHandler') && (typeof props.refreshHandler) == 'function' ;
        this.state.enable[SIDE.BOTTOM] = props.hasOwnProperty('moreHandler') && (typeof props.moreHandler) == 'function';
    }


    //通过dom绑定touchstart来解决material-ui阻止touchstart的问题
    _bindEvents(){
        this.domRefs.document.body.addEventListener('touchstart', this._eventHandler.dragStart);
    }

    //在组件即将被销毁的时候, 解绑body的事件
    _unbindEvents(){
        this.domRefs.document.body.removeEventListener('touchstart', this._eventHandler.dragStart);
    }

    /**
     * 定义动态state
     * 为了解决组件状态发生改变时,不想触发自己的render,但是想要改变子组件的状态.
     * 通过PropertySetter来调用子组件改变对应状态的方法.
     */
    _initDynamicState() {
        //定义state.status
        Object.defineProperty(this.state, 'status', {
            get: () => {
                return this._stateInShadow.status;
            },
            set: (value) => {
                if (this._stateInShadow.status != value) {
                    this._stateInShadow.status = value;

                    //根据拖拽方向判断当前更新的状态
                    const refresher = this.state.direction == DIRECTION.DOWN ? this.refs.header : this.refs.footer;
                    const enable = this.state.direction == DIRECTION.DOWN ? this.state.enable[SIDE.TOP] : this.state.enable[SIDE.BOTTOM];

                    if (enable) {
                        //更新子组件的状态
                        refresher.updateStatus(this._stateInShadow.status, this.state.deltaPercent);
                    }
                }
            }
        });

        //定义isReach
        Object.defineProperty(this.state, 'isReach', {
            get: () => {
                return this.state.reach[SIDE.TOP] || this.state.reach[SIDE.BOTTOM]
            }
        });

        //定义弹性
        Object.defineProperty(this.state, 'springConstant', {
            value: this.props.resistance
        });

    }


    //当外部加载数据完成,调用这个方法重置动画状态
    completeAnimation() {

        if (this.state.status == STATUS.DOING) {
            this.state.status = STATUS.INITIAL;
            //如果完成的时候, 顶部还贴边, 则进行回弹, 如果在过程中进行了滚动, refreshSide为null, 不做任何处理
            if (this.state.refreshSide == SIDE.TOP) {
                this._method.scrollTo(0, 0, 400);
            }
        }

    }


    //提供对外滚动方法
    scrollTo(deltaY , duration=0){
        this._deltaY = deltaY;
        this._method.scrollTo(0 , -deltaY , duration);
    }

    //内部方法
    _method = {

        //在手指移动时, 进行滚动
        animateFrame: () => {
            if (!this._state.press) {
                window.cancelAnimationFrame(this._requestAnimationId);
                return;
            }


            if (this._deltaY != this._state.lastAnimateDeltaY) {
                this._method.scrollTo(0, this._deltaY);
                this._state.lastAnimateDeltaY = this._deltaY;
            }

            this._requestAnimationId = window.requestAnimationFrame(this._method.animateFrame.bind(this));
        },

        //计算速度
        computeVelocity: () => {

            //当用户快速移动并停止一段时间后,松手依旧会触发惯性,是因为没有计算松手时间, 在这里重新更新时间戳, 保证速度计算正确
            //防止在timer间隙的时候计算速度, 导致没有获取到当前时间
            if(this._state.timestamp == this._state.lastTime){
                this._state.timestamp = Date.now();
            }

            //滑动时间
            var deltaTime = this._state.timestamp - this._state.lastTime;
            this._state.lastTime = this._state.timestamp;
            //滑动距离
            var deltaY = this._state.pageY - this._state.lastPageY;
            this._state.lastPageY = this._state.pageY;

            if (deltaTime == 0 && deltaY == 0) {
                this._state.velocity = 0;
            }else{
                //保证最小时间为10ms
                deltaTime = Math.max(10, deltaTime);
                //根据路程求出阻尼系数
                const speedResistance = Math.min(Math.abs(deltaY / 180), 1);
                //速度
                this._state.velocity = deltaY / deltaTime * speedResistance;
            }


        },

        //计算惯性移动
        doInertial: (speed) => {

            //0.005以内的惯性,忽略不计,小步长移动速度大概在0.005上下, 更贴近ios效果
            if (!speed || speed < 0.002 && speed > -0.002) {
                return false;
            }

            let _speed = 0;

            const _maxSpeed = 2.0;

            //设置最大速度为0.8 , 避免出现速度过快导致闪屏的问题
            if (speed > 0) {
                _speed = Math.min(speed, _maxSpeed);
            } else {
                _speed = Math.max(speed, -_maxSpeed);
            }

            const speedResistance = Math.min(Math.abs(_speed / 4), 1);


            let time = 1800 + 1000 * speedResistance;
            let a = -_speed / time;

            let distance = _speed * time + a * time * time / 2;


            this.state.inertialDistance = distance;

            distance += this._deltaY;

            let {deltaY, ease, duration} = this._method.outOfScreen(distance, time);

            this._method.scrollTo(0, deltaY, duration, true, ease);

            return true;

        },

        //判断当前的滚动目标位置是否超出显示范围
        outOfScreen: (deltaY, duration = 0) => {

            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            const topLine = this.state.direction == DIRECTION.DOWN && this.state.status == STATUS.DOING ? this.props.distanceToRefresh : 0;

            //如果内容超过视图,maxheight为差值,如果内容小于视图,那直接就应该有阻尼
            const bottomLine = contentHeight > clientHeight ? contentHeight - clientHeight : 0;

            let _deltaY, _duration, _ease;


            if (deltaY >= topLine) {
                _deltaY = topLine;
                // _duration = duration * (this._deltaY - _deltaY) / (this._deltaY - deltaY);
                _duration = 600;
                _ease = cubic.outCubic; //cubic.easeOutBack;
            } else if (deltaY <= -bottomLine) {
                _deltaY = -bottomLine;
                _duration = 600;
                // _duration = duration * (this._deltaY - _deltaY) / (this._deltaY - deltaY);
                _ease = cubic.outCubic; //cubic.easeOutBack;
            } else {
                _deltaY = deltaY;
                _duration = duration;
                _ease = cubic.outCubic;
            }

            return {deltaY: _deltaY, duration: Math.abs(_duration), ease: _ease};

        },

        //移动到指定位置
        scrollTo: (deltaX = 0, deltaY = 0, duration = 0, isInertial = false, ease = cubic.outCubic) => {
            const {clientHeight, contentHeight, topLine, bottomLine} = this._method.getTriggerLine();

            if (deltaY > topLine || deltaY < bottomLine) {
                ease = cubic.quadratic;
            }

            const dom = this.domRefs.list;

            const cssText = [
                '-webkit-transition-timing-function:', ease, ';',
                'transition-timing-function:', ease, ';',
                '-webkit-transition-duration:', duration, 'ms;',
                'transition-duration:', duration, 'ms;',
                '-webkit-transform:', `translate3d(${deltaX}px,${deltaY}px, 0px);`,
                'transform:', `translate3d(${deltaX}px,${deltaY}px, 0px);`
            ].join('');

            dom.style.cssText = dom.style.cssText + cssText;


            this._method.stopInertialTimer();

            if (isInertial) {
                //在惯性移动中,模拟移动事件
                this._method.startInertialTimer(duration);
            }

            this._method.updateScrollBar();

            if(!isInertial){
                this._eventHandler.scroll({
                    scrollTop: parseInt(-deltaY),
                    offsetHeight: clientHeight,
                    scrollHeight: contentHeight,
                    press: this._state.press
                });
            }

        },

        //移动模拟滚动条位置
        updateScrollBar: (y) => {

            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            const {scrollBar} = this.refs;

            const deltaY = y ? y : this._deltaY;

            if (deltaY > 0) {
                return;
            }

            scrollBar.show();
            scrollBar.scrollTo({deltaY, contentHeight, clientHeight});

            if (!this._state.press) {
                clearTimeout(this._hideScrollbarUI);
                this._hideScrollbarUI = setTimeout(() => {
                    scrollBar.hide();
                }, 500);
            }


        },

        //在惯性移动过程中, 按60帧的速率, 模拟滚动事件
        startInertialTimer: (duration) => {

            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            if (this._durationEventTrigger) {
                clearInterval(this._durationEventTrigger);
                this._durationEventTrigger = 0;
            }

            //按照40帧的速度进行时间模拟(实际不会达到40帧)
            this._durationEventTrigger = setInterval(() => {
                const matrix = tools.parseTranslateMatrix(window.getComputedStyle(this.domRefs.list).webkitTransform);

                //toFixed是为了防止出现 -1.57565e-7 这样的数字
                this._deltaY = parseFloat(matrix.y.toFixed(2));

                this._eventHandler.scroll({
                    scrollTop: parseInt(-this._deltaY),
                    offsetHeight: clientHeight,
                    scrollHeight: contentHeight,
                    press: this._state.press
                });

                this._method.updateScrollBar();

            }, 25);

            //独立使用一个timeout , 保证duration之后 , 肯定会被clear;
            this._clearDurationEventTriggerTimeout = setTimeout(() => {
                // console.log('clear interval');
                clearInterval(this._durationEventTrigger);
            }, duration);
        },

        //停止模拟惯性事件
        stopInertialTimer: () => {
            if (this._durationEventTrigger) {
                clearInterval(this._durationEventTrigger);
                this._durationEventTrigger = 0;
            }
            if (this._clearDurationEventTriggerTimeout) {
                clearTimeout(this._clearDurationEventTriggerTimeout);
                this._clearDurationEventTriggerTimeout = 0;
            }

        },

        //计算触发刷新的位置
        getTriggerLine: () => {
            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            //定义顶部位置 , 顶部触发位置 , 底部位置 ,底部触发位置
            const topLine = this.state.status == STATUS.DOING && this.state.direction == DIRECTION.DOWN ? this.props.distanceToRefresh : 0;
            const topTriggerLine = this.props.distanceToRefresh;
            const bottomLine = contentHeight >= clientHeight ? -(contentHeight - clientHeight) : 0;
            const bottomTriggerLine = bottomLine - this.props.distanceToRefresh;

            return {clientHeight, contentHeight, topLine, topTriggerLine, bottomLine, bottomTriggerLine};
        },

        //检测是否需要 刷新/加载更多 的操作
        checkLoadWhenDragEnd: () => {

            if (!this.state.isReach) {
                return;
            }

            const {distanceToRefresh, refreshHandler, moreHandler, loadingMinTime} = this.props;
            const {refreshSide} = this.state;
            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            const topLine = 0;
            const topTriggerLine = this.props.distanceToRefresh;
            const bottomLine = contentHeight >= clientHeight ? -(contentHeight - clientHeight) : 0;
            const bottomTriggerLine = bottomLine - distanceToRefresh;

            //边线
            const line = {
                [SIDE.TOP]: topLine,
                [SIDE.BOTTOM]: bottomLine
            };

            //触发线
            const triggerLine = {
                [SIDE.TOP]: topTriggerLine,
                [SIDE.BOTTOM]: bottomTriggerLine
            };

            //回调函数
            const handler = {
                [SIDE.TOP]: refreshHandler,
                [SIDE.BOTTOM]: moreHandler
            };

            //拖拽方向
            const direction = {
                [SIDE.TOP]: DIRECTION.DOWN,
                [SIDE.BOTTOM]: DIRECTION.UP
            };


            let targetDeltaY = 0;

            //当前状态处于触发状态
            if (this.state.status == STATUS.TRIGGER) {

                let actionHandler = undefined;
                //判断是否可以进行对应的刷新操作
                let canDo = refreshSide && (this.state.reach[refreshSide] && this.state.enable[refreshSide] && this.state.direction == direction[refreshSide]);

                if (canDo) {

                    targetDeltaY = triggerLine[refreshSide];
                    actionHandler = handler[refreshSide];

                    this.state.status = STATUS.DOING;

                    setTimeout(()=> {
                        actionHandler(this.completeAnimation.bind(this));
                    }, loadingMinTime);

                } else {

                    targetDeltaY = line[refreshSide];

                }


            //如果在加载中, 则不做任何处理, 否则可能影响当前正在进行的动画
            } else if (this.state.status == STATUS.DOING) {

                return;
                // targetDeltaY = triggerLine[this.state.refreshSide];

            //到达边界, 但是又不够触发距离, 则应该弹回对应的顶部
            } else {

                targetDeltaY = line[refreshSide];

            }

            this._deltaY = targetDeltaY;
            this._method.scrollTo(0, targetDeltaY, 400);
        },

        //检测事件是否触发在当前组件上, 由于dragStart绑定在body上, 所以需要检测事件范围
        checkEventInThis: (target) => {
            var _target = target;
            while(_target){
                if(_target == this.domRefs.domNode){
                   return true;
                }else{
                    _target = _target.parentNode;
                }
            }
            return false;
        },

        startCheckOutOfRangeTimer: () => {
            this._checkOutOfRangeTimer = setInterval(() => {

                this._method.checkOutOfRange();

            }, 16.7);

        },

        stopCheckOutOfRangeTimer: () => {
            clearInterval(this._checkOutOfRangeTimer);
        },

        //检测
        checkOutOfRange: () => {
            // console.log('check out of range');

            //如果用户正在交互, 不做任何处理
            if(this._state.press){
                return;
            }

            const clientHeight = this.domRefs.domNode.clientHeight;
            const contentHeight = this.domRefs.list.clientHeight;

            // console.log('clientHeight', clientHeight, 'contentHeight', contentHeight);
            if (contentHeight < clientHeight) {
                return;
            }

            const computeScrollTop = contentHeight - clientHeight;

            //如果内容底部不够到达边界, 则需要往上滚动调整到边界处;
            if (computeScrollTop < Math.abs(this._deltaY) && this.state.status != STATUS.DOING) {
                this._deltaY = -computeScrollTop;
                //如果当前是处于边界状态, 需要将_reachSideDeltaY同时更新, 保证后续的回弹位置正确
                //2016-11-13 只有在reachBottom时, 才需要设置, 如果是顶部内容不够, 不用更新_reachSideDeltaY
                // if(this.state.reach[SIDE.TOP] || this.state.reach[SIDE.BOTTOM]){
                if(this.state.reach[SIDE.BOTTOM] && !this.state.reach[SIDE.TOP]){
                    this._reachSideDeltaY = -computeScrollTop;
                }
                this._method.scrollTo(0, this._deltaY);
            }
        }


    };

    //事件处理
    _eventHandler = {
        //手指按下
        dragStart: (event) => {

            //判断事件在当前组件上
            if(!this._method.checkEventInThis(event.target)){
                return;
            }

            //停止惯性 , 并在当前位置停住
            this._method.stopInertialTimer();
            const {transform, webkitTransform} = window.getComputedStyle(this.domRefs.list);
            const matrix = tools.parseTranslateMatrix(transform || webkitTransform);
            this._deltaY = matrix.y;
            this._method.scrollTo(matrix.x, matrix.y, 0);


            //手指按下时, 记录当前的初始位置,时间等数据.
            const {pageY} = event.touches[0];

            this._lastDeltaY = this._deltaY;
            this._startPageY = pageY;


            this._state.press = true;
            this._state.timestamp = Date.now();
            this._state.lastTime = this._state.timestamp;
            this._state.velocity = 0;
            this._state.pageY = pageY;
            this._state.lastPageY = pageY;

            this._velocityTimer = setInterval(this._method.computeVelocity.bind(this), 10);

            this._requestAnimationId = window.requestAnimationFrame(this._method.animateFrame.bind(this));

            this.refs.scrollBar.show();

        },

        //手指移动
        dragMove: (e) => {
            //e.preventDefault();

            const {pageY} = e.touches[0];
            const now = Date.now();

            const {topLine, bottomLine, topTriggerLine, bottomTriggerLine} = this._method.getTriggerLine();

            this._deltaY = this._lastDeltaY + (pageY - this._startPageY);

            this.state.direction = pageY > this._startPageY ? DIRECTION.DOWN : DIRECTION.UP;


            //代码移至滚动事件处理中
            // this.state.reach[SIDE.TOP] = this._deltaY >= topLine;
            // this.state.reach[SIDE.BOTTOM] = this._deltaY <= bottomLine;

            //到达边界后, 移动应该有阻尼效果
            if(this.state.reach[SIDE.TOP] || this.state.reach[SIDE.BOTTOM]){
                this._deltaY = this._reachSideDeltaY + (this._deltaY - this._reachSideDeltaY) / this.props.resistance;
            }

            // 拉动到触发时的百分比
            const refresher = this.state.direction == DIRECTION.DOWN ? this.refs.header : this.refs.footer;
            refresher.updateStyle(this.state.reach[SIDE.TOP] ? (Math.abs(this._deltaY) / topTriggerLine): (Math.abs(this._deltaY) / bottomTriggerLine));
            this._state.pageY = pageY;
            this._state.timestamp = now;

            if (this.state.status == STATUS.DOING) {
                return;
            }


            const triggerTop = this.state.reach[SIDE.TOP] && this._deltaY > topTriggerLine;
            const triggerBottom = this.state.reach[SIDE.BOTTOM] && this._deltaY < bottomTriggerLine;

            // console.log('move triggerTop' , triggerTop , 'triggerBottom' , triggerBottom);

            //顶部到达触发线并且启用
            if (triggerTop && this.state.enable[SIDE.TOP]){
                this.state.refreshSide = SIDE.TOP;

                if (this.state.status != STATUS.TRIGGER) {
                    this.state.status = STATUS.TRIGGER;
                }

            //底部到达触发线并且启用
            }else if(triggerBottom && this.state.enable[SIDE.BOTTOM]){
                this.state.refreshSide = SIDE.BOTTOM;

                if (this.state.status != STATUS.TRIGGER) {
                    this.state.status = STATUS.TRIGGER;
                }

            } else {
                // console.log('change to initial');
                if (this.state.status != STATUS.INITIAL) {
                    this.state.status = STATUS.INITIAL;
                }
            }


        },

        //手指抬起
        dragEnd: () => {

            this._state.press = false;

            window.cancelAnimationFrame(this._requestAnimationId);
            clearInterval(this._velocityTimer);


            //防止高频率小步长移动时, timer来不及计算速度就被停止;
            if(this._state.velocity == 0){
                this._method.computeVelocity();
            }

            //如果不做惯性,则抛出一次scrollTo事件
            if(!this._method.doInertial(this._state.velocity)){
                //抬起后再次出发scroll
                this._method.scrollTo(0, this._deltaY);
            }

            //检测是否需要 刷新/加载更多 的操作
            this._method.checkLoadWhenDragEnd();

            //清空速度
            this._state.velocity = 0;

            //如果在顶部松手, 则需要充值reachSideDeltaY, 如果在底部, 清空会导致跳屏
            if(this.state.reach[SIDE.TOP]){
                //清空到达边界的deltaY
                this._reachSideDeltaY = 0;
            }


            this.refs.scrollBar.hide();


        },

        scroll: (event) => {

            const {scrollTop , offsetHeight , scrollHeight} = event;

            const {topLine, bottomLine, topTriggerLine, bottomTriggerLine} = this._method.getTriggerLine();

            //原来的处理顺序有问题, 当内容只比视窗大小大一点时, 会先触发另一边的reach , 才触发leave, 逻辑顺序错误
            if(scrollTop > topLine) {
                if(this.state.reach[SIDE.TOP]){
                    this.state.reach[SIDE.TOP] = false;
                    this._eventHandler.leaveTop();
                }

            }

            if(scrollTop + offsetHeight < scrollHeight){
                if(this.state.reach[SIDE.BOTTOM]){
                    this.state.reach[SIDE.BOTTOM] = false;
                    this._eventHandler.leaveBottom();
                }

            }

            if(scrollTop <= topLine){
                if(!this.state.reach[SIDE.TOP]){
                    this.state.reach[SIDE.TOP] = true;
                    this._eventHandler.reachTop();
                }
            }

            if(scrollTop + offsetHeight >= scrollHeight){
                if(!this.state.reach[SIDE.BOTTOM]){
                    this.state.reach[SIDE.BOTTOM] = true;
                    this._eventHandler.reachBottom();
                }
            }

            // if(scrollTop <= topLine) {
            //     if(!this.state.reach[SIDE.TOP]){
            //         this.state.reach[SIDE.TOP] = true;
            //         this._eventHandler.reachTop();
            //     }
            // }else if(scrollTop + offsetHeight >= scrollHeight){
            //     if(!this.state.reach[SIDE.BOTTOM]){
            //         this.state.reach[SIDE.BOTTOM] = true;
            //         this._eventHandler.reachBottom();
            //     }
            // }else{
            //     if(this.state.reach[SIDE.TOP]){
            //         this.state.reach[SIDE.TOP] = false;
            //         this._eventHandler.leaveTop();
            //     }
            //
            //     if(this.state.reach[SIDE.BOTTOM]){
            //         this.state.reach[SIDE.BOTTOM] = false;
            //         this._eventHandler.leaveBottom();
            //     }
            //
            // }

            if (this.props.scrollHandler) {
                this.props.scrollHandler(event);
            }
        },

        reachTop: () => {
            this._reachSideDeltaY = this._deltaY;
            this.state.refreshSide = SIDE.TOP;
            this.domRefs.headerRefresh.style.display = this.state.enable[SIDE.TOP] ? 'block' : 'none';
        },

        leaveTop: () => {
            this._reachSideDeltaY = 0;
            this.state.refreshSide = null;
            this.domRefs.headerRefresh.style.display = 'none';
        },

        reachBottom: () => {
            this._reachSideDeltaY = this._deltaY;
            this.state.refreshSide = SIDE.BOTTOM;
            this.domRefs.footerRefresh.style.display = this.state.enable[SIDE.BOTTOM] ? 'block' : 'none';
        },

        leaveBottom: () => {
            this._reachSideDeltaY = 0;
            this.state.refreshSide = null;
            this.domRefs.footerRefresh.style.display = 'none';

        }

    };


    //初始化dom指针
    _initDomRefs() {

        this.domRefs.domNode = ReactDOM.findDOMNode(this);
        this.domRefs.list = ReactDOM.findDOMNode(this.refs.list);
        this.domRefs.headerRefresh = ReactDOM.findDOMNode(this.refs.header);
        this.domRefs.footerRefresh = ReactDOM.findDOMNode(this.refs.footer);

        //寻找document对象, 不通过window.document是因为有可能组件被渲染到其他iframe中
        //当script和dom不再同一个window对象下时, 会导致touchstart监听失败
        let node = this.domRefs.domNode.parentNode;

        while(node && node.constructor.toString().indexOf('HTMLDocument') == -1){
            node = node.parentNode;
        }

        if(node){
            this.domRefs.document = node;
        }else{
            this.domRefs.document = document;
        }

    }


    render() {

        const styles = getStyles(this.props, this.context);


        //头部PullRefresh图标
        const refreshLoading = (
            <Refresher
                ref="header"
                style={{position:'absolute',top:0}}
                enable={this.state.enable[SIDE.TOP]}
                type={this.props.loadingStyle}
                distanceToRefresh={this.props.distanceToRefresh}
                statusLabel={this.props.refreshStatusLabel}
                color={styles.refresh.color}
                direction={DIRECTION.DOWN}
                status={this.state.status}

            />
        );

        //内容区
        const content = (
            <div
                ref="list"
                style={styles.content}
            >
                <div ref="fixKeyboardJumpHook" style={styles.fixKeyboardJumpTop} ></div>
                {this.props.children}
                <div ref="fixKeyboardJumpHook" style={styles.fixKeyboardJumpBottom} ></div>
            </div>
        );

        //底部LoadMore图标
        const moreLoading = (
            <Refresher
                ref="footer"
                style={{position:'absolute',bottom:0}}
                enable={this.state.enable[SIDE.BOTTOM]}
                type={this.props.loadingStyle}
                distanceToRefresh={this.props.distanceToRefresh}
                statusLabel={this.props.moreStatusLabel}
                color={styles.more.color}
                direction={DIRECTION.UP}
                status={this.state.status}

            />
        );

        return (
            <div style={styles.root}
                 className={this.props.className}

                 //onTouchStart={this._eventHandler.dragStart}
                 onTouchMove={this._eventHandler.dragMove}
                 onTouchEnd={this._eventHandler.dragEnd}

            >

                {refreshLoading}

                {content}

                {moreLoading}


                <ScrollBar
                    ref="scrollBar"
                />
            </div>
        );
    }

}

export default WrapperForSimulate;
