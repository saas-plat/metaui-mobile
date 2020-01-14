/**
 * Created by TonyJiang on 16/5/30.
 */
import {px2px} from './pixel';
import {TYPE} from './constant';
import PropTypes from 'prop-types';


const propTypes = {
    //是否启用顶部下拉刷新 , 默认值: true
    // enableRefresh: PropTypes.bool,
    //是否启动底部上拉加载 , 默认值: true
    // enableLoadMore: PropTypes.bool,
    //处于loading状态后延迟多长时间真正触发事件 , 默认值: 0
    loadingMinTime: PropTypes.number,
    //顶部和底部触发刷新时, 显示文字还是图标, 默认图标
    loadingStyle: PropTypes.oneOf([TYPE.ICON, TYPE.LABEL]),

    displayWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    displayHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    //refresh提示的颜色 , icon 或者 文字的颜色
    refreshColor: PropTypes.string,
    //refresh提示的颜色 , icon 或者 文字的颜色
    moreColor: PropTypes.string,

    className: PropTypes.string,

    //弹性系数 , 默认值: 2.5
    resistance: PropTypes.number,
    //触发刷新的距离 , 默认值: 45
    distanceToRefresh: PropTypes.number,
    //是否强制使用模拟版
    useSimulate: PropTypes.bool,

    //触发刷新的回调函数
    refreshHandler: PropTypes.func,
    //触发加载更多的回调函数
    moreHandler: PropTypes.func,
    //触发滚动事件
    scrollHandler: PropTypes.func,

    //刷新状态对应的文字
    refreshStatusLabel: PropTypes.object,
    //加载更多状态对应的文字
    moreStatusLabel: PropTypes.object,

    //内容区的背景色设置
    contentBackgroundColor: PropTypes.string,

    //内容区后边在LoadMore和PullRefresh时能看到的背景
    totalBackgroundColor: PropTypes.string



};

const defaultProps = {
    enableRefresh: true,
    enableLoadMore: true,
    loadingMinTime: 0,
    loadingStyle: TYPE.ICON,

    displayWidth: '100%',
    displayHeight: '100%',

    refreshColor: '#ccc',
    moreColor: '#ccc',

    className: '',

    resistance: 2.5,
    distanceToRefresh: px2px(65 * 2, true),
    useSimulate: false,

    refreshStatusLabel: {
        'init': '下拉刷新',
        'trigger': '松开刷新',
        'loading': '正在刷新...',
        'done': '完成'
    },
    moreStatusLabel: {
        'init': '上拉加载',
        'trigger': '松开加载',
        'loading': '正在加载...',
        'done': '完成'
    },

    contentBackgroundColor: '#FFFFFF',
    rootBackgroundColor: '#F5F5F5'
};

export {propTypes , defaultProps};
