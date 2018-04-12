"use strict";
function _classCallCheck(e, t) {
    if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function");
}
var _createClass = function () {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
        }
    }
    return function (t, n, i) { return n && e(t.prototype, n), i && e(t, i), t; };
}(), Collapse = function (e) {
    var t = "collapse", n = "4.0.0-alpha", i = "bs.collapse", a = "." + i, s = ".data-api", r = e.fn[t], l = 600, o = { toggle: !0, parent: "" }, g = { toggle: "boolean", parent: "string" }, h = { SHOW: "show" + a, SHOWN: "shown" + a, HIDE: "hide" + a, HIDDEN: "hidden" + a, CLICK_DATA_API: "click" + a + s }, u = { IN: "in", COLLAPSE: "collapse", COLLAPSING: "collapsing", COLLAPSED: "collapsed" }, d = { WIDTH: "width", HEIGHT: "height" }, _ = { ACTIVES: ".panel > .in, .panel > .collapsing", DATA_TOGGLE: '[data-toggle="collapse"]' }, c = function () {
        function a(t, n) { _classCallCheck(this, a), this._isTransitioning = !1, this._element = t, this._config = this._getConfig(n), this._triggerArray = e.makeArray(e('[data-toggle="collapse"][href="#' + t.id + '"],' + ('[data-toggle="collapse"][data-target="#' + t.id + '"]'))), this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle(); }
        return _createClass(a, [{ key: "toggle", value: function () { e(this._element).hasClass(u.IN) ? this.hide() : this.show(); } }, { key: "show", value: function () {
                    var t = this;
                    if (!this._isTransitioning && !e(this._element).hasClass(u.IN)) {
                        var n = void 0, s = void 0;
                        if (this._parent && (n = e.makeArray(e(_.ACTIVES)), n.length || (n = null)), !(n && (s = e(n).data(i), s && s._isTransitioning))) {
                            var r = e.Event(h.SHOW);
                            if (e(this._element).trigger(r), !r.isDefaultPrevented()) {
                                n && (a._jQueryInterface.call(e(n), "hide"), s || e(n).data(i, null));
                                var o = this._getDimension();
                                e(this._element).removeClass(u.COLLAPSE).addClass(u.COLLAPSING), this._element.style[o] = 0, this._element.setAttribute("aria-expanded", !0), this._triggerArray.length && e(this._triggerArray).removeClass(u.COLLAPSED).attr("aria-expanded", !0), this.setTransitioning(!0);
                                var g = function () { e(t._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).addClass(u.IN), t._element.style[o] = "", t.setTransitioning(!1), e(t._element).trigger(h.SHOWN); };
                                if (!Util.supportsTransitionEnd())
                                    return void g();
                                var d = o[0].toUpperCase() + o.slice(1), c = "scroll" + d;
                                e(this._element).one(Util.TRANSITION_END, g).emulateTransitionEnd(l), this._element.style[o] = this._element[c] + "px";
                            }
                        }
                    }
                } }, { key: "hide", value: function () {
                    var t = this;
                    if (!this._isTransitioning && e(this._element).hasClass(u.IN)) {
                        var n = e.Event(h.HIDE);
                        if (e(this._element).trigger(n), !n.isDefaultPrevented()) {
                            var i = this._getDimension(), a = i === d.WIDTH ? "offsetWidth" : "offsetHeight";
                            this._element.style[i] = this._element[a] + "px", Util.reflow(this._element), e(this._element).addClass(u.COLLAPSING).removeClass(u.COLLAPSE).removeClass(u.IN), this._element.setAttribute("aria-expanded", !1), this._triggerArray.length && e(this._triggerArray).addClass(u.COLLAPSED).attr("aria-expanded", !1), this.setTransitioning(!0);
                            var s = function () { t.setTransitioning(!1), e(t._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).trigger(h.HIDDEN); };
                            return this._element.style[i] = 0, Util.supportsTransitionEnd() ? void e(this._element).one(Util.TRANSITION_END, s).emulateTransitionEnd(l) : void s();
                        }
                    }
                } }, { key: "setTransitioning", value: function (e) { this._isTransitioning = e; } }, { key: "dispose", value: function () { e.removeData(this._element, i), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null; } }, { key: "_getConfig", value: function (n) { return n = e.extend({}, o, n), n.toggle = Boolean(n.toggle), Util.typeCheckConfig(t, n, g), n; } }, { key: "_getDimension", value: function () { var t = e(this._element).hasClass(d.WIDTH); return t ? d.WIDTH : d.HEIGHT; } }, { key: "_getParent", value: function () { var t = this, n = e(this._config.parent)[0], i = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]'; return e(n).find(i).each(function (e, n) { t._addAriaAndCollapsedClass(a._getTargetFromElement(n), [n]); }), n; } }, { key: "_addAriaAndCollapsedClass", value: function (t, n) {
                    if (t) {
                        var i = e(t).hasClass(u.IN);
                        t.setAttribute("aria-expanded", i), n.length && e(n).toggleClass(u.COLLAPSED, !i).attr("aria-expanded", i);
                    }
                } }], [{ key: "_getTargetFromElement", value: function (t) { var n = Util.getSelectorFromElement(t); return n ? e(n)[0] : null; } }, { key: "_jQueryInterface", value: function (t) {
                    return this.each(function () {
                        var n = e(this), s = n.data(i), r = e.extend({}, o, n.data(), "object" == typeof t && t);
                        if (!s && r.toggle && /show|hide/.test(t) && (r.toggle = !1), s || (s = new a(this, r), n.data(i, s)), "string" == typeof t) {
                            if (void 0 === s[t])
                                throw new Error('No method named "' + t + '"');
                            s[t]();
                        }
                    });
                } }, { key: "VERSION", get: function () { return n; } }, { key: "Default", get: function () { return o; } }]), a;
    }();
    return e(document).on(h.CLICK_DATA_API, _.DATA_TOGGLE, function (t) { t.preventDefault(); var n = c._getTargetFromElement(this), a = e(n).data(i), s = a ? "toggle" : e(this).data(); c._jQueryInterface.call(e(n), s); }), e.fn[t] = c._jQueryInterface, e.fn[t].Constructor = c, e.fn[t].noConflict = function () { return e.fn[t] = r, c._jQueryInterface; }, c;
}(jQuery);
