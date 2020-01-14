/**
 * Created by TonyJiang on 16/4/7.
 */
const TYPE = {
    ICON : 'icon',
    LABEL : 'label'
};

const STATUS = {
    INITIAL : 'INITIAL',
    TRIGGER : 'TRIGGER',
    DOING : 'DOING',
    DONE : 'DONE'
};

const REFRESH_STATUS_LABEL = {
    INITIAL : '下拉刷新',
    TRIGGER : '松开即可刷新',
    DOING : '正在刷新...',
    DONE : '完成'
};

const MORE_STATUS_LABEL = {
    INITIAL : '上拉加载',
    DOING : '正在加载...',
    TRIGGER : '松开加载更多',
    DONE : '完成'
};

const DIRECTION = {
    UP : 'up',
    DOWN : 'down'
};

const SIDE = {
    TOP : 'top',
    BOTTOM : 'bottom'
};

export {TYPE , STATUS , REFRESH_STATUS_LABEL , MORE_STATUS_LABEL , DIRECTION , SIDE};