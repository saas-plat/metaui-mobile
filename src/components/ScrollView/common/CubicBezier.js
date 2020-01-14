/**
 * Created by TonyJiang on 16/5/16.
 */

class Matrix {

    constructor(config) {
        this._init(config);
    }

    _init(config) {
        if (config && config.data)
            this.data = config.data;
    }

    /**
     * 矩阵相乘
     * @param {matrix} m 被乘的矩阵
     */
    mul(m) {
        var r = [], s = this.data, m = m.data,
            p = s[0].length //每次运算相加的次数
        if (m.length != s[0].length) {
            T.trace("矩阵不能相乘")
        }
        for (var i = 0; i < s.length; i++) {
            r[i] = []
            for (var n = 0; n < m[0].length; n++) {
                r[i][n] = 0;
                for (var l = 0; l < p; l++) {
                    r[i][n] += s[i][l] * m[l][n];
                }
            }
        }
        this.data = r;
        return this;
    }

    set(data) {
        this.data = data;
    }

    get() {
        return this.data
    }

    toString() {
        return this.data.to_s()
    }
}

class CubicBezier {

    constructor(config){
        this._init(config);
    }

    _init(points) {
        var p = this.points = {
            p0 : [0,0],
            p1 : [points[0] , points[1]],
            p2 : [points[2] , points[3]],
            p3 : [1,1]
        };
        
        this.m1 = new Matrix();
        this.m2 = new Matrix({
            data: [
                [1, 0, 0, 0],
                [-3, 3, 0, 0],
                [3, -6, 3, 0],
                [-1, 3, -3, 1]
            ]
        });
        this.m3 = new Matrix({
            data: [
                p.p0,
                p.p1,
                p.p2,
                p.p3
            ]
        })
        this.m = null
    };

    /**
     * 获取某个时间点计算出来的坐标值,时间线不由此类控制
     */
    get(t) {
        this.m1.set([
            [1, t * t, t * t * t, t * t * t * t]
        ]);
        this.m = this.m1.mul(this.m2).mul(this.m3)
        return [this.m.get()[0][0], this.m.get()[0][1]];
    }
}

export default CubicBezier;