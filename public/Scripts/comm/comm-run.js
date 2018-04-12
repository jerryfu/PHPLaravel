(function () {
    var testObject = {};
    if (!(Object.setPrototypeOf || testObject.__proto__)) {
        var nativeGetPrototypeOf = Object.getPrototypeOf;
        Object.getPrototypeOf = function (object) {
            if (object.__proto__) {
                return object.__proto__;
            }
            else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        };
    }
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }
                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);
                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }
    if (Array.prototype.optMake === undefined) {
        Array.prototype.optMake = function (func1, func2) {
            const _this = this;
            let p = new Array();
            let values = _this.map(func1);
            let items = _this.map(func2);
            for (var i = 0; i < values.length; i++) {
                let v = values[i];
                let t = items[i].toString();
                let o = {
                    value: v, label: t
                };
                p.push(o);
            }
            return p;
        };
    }
    if (Array.prototype.sum === undefined) {
        Array.prototype.sum = function (func) {
            const _this = this;
            let get_sum = _this
                .map(func)
                .reduce((pre, cur) => {
                if (cur !== undefined && cur !== null && cur.toString() != '')
                    return pre + cur;
                else
                    return pre;
            }, 0);
            return get_sum;
        };
    }
    if (Number.prototype.floatSpot === undefined) {
        Number.prototype.floatSpot = function (pos) {
            if (this !== undefined && this !== null) {
                let size = Math.pow(10, pos);
                return Math.round(this * size) / size;
            }
        };
    }
    if (Number.prototype.divisor === undefined) {
        Number.prototype.divisor = function (num) {
            if (this != undefined && this !== null && num) {
                return this / num;
            }
        };
    }
    if (Array.prototype.findIndex === undefined) {
        Array.prototype.findIndex = function (func) {
            let index = -1;
            const _this = this;
            _this.map(func).forEach((item, i) => {
                if (item) {
                    index = i;
                }
            });
            return index;
        };
    }
    if (Array.prototype.find === undefined) {
        Array.prototype.find = function (func) {
            const _this = this;
            let res = _this.filter(func);
            let obj = res.length > 0 ? res[0] : null;
            return obj;
        };
    }
})();
