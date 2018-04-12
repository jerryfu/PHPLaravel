"use strict";
var Util = function (n) {
    function t(n) { return {}.toString.call(n).match(/\s([a-zA-Z]+)/)[1].toLowerCase(); }
    function e(n) { return (n[0] || n).nodeType; }
    function r() { return { bindType: u.end, delegateType: u.end, handle: function (t) { return n(t.target).is(this) ? t.handleObj.handler.apply(this, arguments) : void 0; } }; }
    function i() {
        if (window.QUnit)
            return !1;
        var n = document.createElement("bootstrap");
        for (var t in s)
            if (void 0 !== n.style[t])
                return { end: s[t] };
        return !1;
    }
    function o(t) { var e = this, r = !1; return n(this).one(d.TRANSITION_END, function () { r = !0; }), setTimeout(function () { r || d.triggerTransitionEnd(e); }, t), this; }
    function a() { u = i(), n.fn.emulateTransitionEnd = o, d.supportsTransitionEnd() && (n.event.special[d.TRANSITION_END] = r()); }
    var u = !1, s = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }, d = { TRANSITION_END: "bsTransitionEnd", getUID: function (n) {
            do
                n += ~~(1e6 * Math.random());
            while (document.getElementById(n));
            return n;
        }, getSelectorFromElement: function (n) { var t = n.getAttribute("data-target"); return t || (t = n.getAttribute("href") || "", t = /^#[a-z]/i.test(t) ? t : null), t; }, reflow: function (n) { new Function("bs", "return bs")(n.offsetHeight); }, triggerTransitionEnd: function (t) { n(t).trigger(u.end); }, supportsTransitionEnd: function () { return Boolean(u); }, typeCheckConfig: function (n, r, i) {
            for (var o in i)
                if (i.hasOwnProperty(o)) {
                    var a = i[o], u = r[o], s = void 0;
                    if (s = u && e(u) ? "element" : t(u), !new RegExp(a).test(s))
                        throw new Error(n.toUpperCase() + ": " + ('Option "' + o + '" provided type "' + s + '" ') + ('but expected type "' + a + '".'));
                }
        } };
    return a(), d;
}(jQuery);
