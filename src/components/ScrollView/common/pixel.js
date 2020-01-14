/**
 * Created by guopeng on 16/4/8.
 */

var rem = window.rem || 75;
var dpr = window.dpr || 1;

export function px2rem(d,isNum) {
    var val = parseFloat(d) / 75;
    if(isNum){
        return val;
    }else{
        val += 'rem';
    }
    return val;
}

export function rem2px(d,isNum) {
    var val = parseFloat(d) * rem ;
    if(isNum){
        return val;
    }else{
        val += 'px';
    }

    return val;
}

/**
 * 按照1rem=75的值转化成当前设备下的px
 * @param d
 * @param isNum
 * @returns {number}
 */
export function px2px(d,isNum) {
    //var val = (parseFloat(d)/2) * dpr * rem/75;
    var val = parseFloat(d)/75*rem;
    if(isNum){
        return val;
    }else{
        val += 'px';
    }
    return val;
}
