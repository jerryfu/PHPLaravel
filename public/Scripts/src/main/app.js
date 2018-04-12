"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const reducers_1 = require("../inc/reducers");
const cbnReduce_1 = require("../inc/cbnReduce");
const param_key_1 = require("../../comm/param_key");
const comm_func_1 = require("../../comm/comm-func");
if (role == 'A') {
    document.location.href = gb_approot + comm_func_1.pv(param_key_1.default.FirstLoginPageUser);
}
else {
    document.location.href = gb_approot + comm_func_1.pv(param_key_1.default.FirstLoginPageUser);
}
class Grid extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        let out_html = React.createElement("div", null,
            React.createElement("h3", { className: "title" },
                "ViewBag.Crumb ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("form", { className: "form-list" },
                React.createElement("dl", { className: "fields" },
                    React.createElement("dt", { className: "col-1" }, "\u767C\u4F48\u65E5\u671F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("input", { className: "form-element", required: true, type: "date" }))),
                React.createElement("dl", { className: "fields" },
                    React.createElement("dt", { className: "col-1" }, "\u6A19\u984C"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("input", { className: "form-element", type: "text" }))),
                React.createElement("dl", { className: "fields" },
                    React.createElement("dt", { className: "col-1" }, "\u524D\u53F0\u986F\u793A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("input", { id: "show1", name: "show", defaultChecked: true, type: "radio" }),
                        React.createElement("label", { htmlFor: "show1" }),
                        "\u986F\u793A",
                        React.createElement("input", { id: "show2", name: "show", type: "radio" }),
                        React.createElement("label", { htmlFor: "show2" }),
                        "\u96B1\u85CF")),
                React.createElement("dl", { className: "fields" },
                    React.createElement("dt", { className: "col-1" }, "\u6392\u5E8F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("input", { defaultValue: '0', className: "form-element inline", type: "number" }),
                        React.createElement("small", null, "\u6578\u5B57\u6108\u5927\u6108\u524D\u9762"))),
                React.createElement("dl", { className: "fields" },
                    React.createElement("dt", { className: "col-1" }, "\u6D88\u606F\u5167\u5BB9"),
                    React.createElement("dd", { className: "col-11" },
                        React.createElement("div", { className: "alert-warning m-b-16" },
                            React.createElement("strong", null, "\u7DE8\u8F2F\u5668\u6CE8\u610F\u4E8B\u9805:"),
                            React.createElement("br", null),
                            "\u5F9E WORD \u8907\u88FD\u6587\u5B57\u6642\uFF0C\u8ACB\u4F7F\u7528\u4E0B\u65B9\u7684 ",
                            React.createElement("img", { src: "/Content/images/icon-word.jpg" }),
                            " \u5716\u793A\u4F86\u8CBC\u4E0A WORD \u6587\u5B57\uFF0C\u907F\u514D\u8DD1\u7248",
                            React.createElement("br", null),
                            "\u7DE8\u8F2F\u5668\u4E0A\u50B3\u5716\u7247\u6216\u65B0\u589E\u8868\u683C\u7B49\u6642\uFF0C\u8ACB\u52FF\u8A2D\u5B9A\u5BEC\u5EA6\u53CA\u9AD8\u5EA6(\u5C07\u6578\u5B57\u522A\u9664) \uFF0C\u4EE5\u514D\u884C\u52D5\u88DD\u7F6E\u986F\u793A\u6642\u6703\u8DD1\u7248\u3002",
                            React.createElement("br", null),
                            "\u6A94\u6848\u5C3A\u5BF8\u5BEC\u5EA6\u8D85\u904E 1600 \u6216 \u9AD8\u5EA6\u8D85\u904E1200 \u7684\u5716\u7247\u6703\u88AB\u58D3\u7E2E(PNG\u900F\u660E\u80CC\u666F\u6703\u8B8A\u6210\u4E0D\u900F\u660E) ",
                            React.createElement("br", null),
                            "youtube \u53EF\u52FE\u9078\u300C\u7528\u81EA\u9069\u61C9\u7E2E\u653E\u6A21\u5F0F\u300D"),
                        React.createElement("textarea", { className: "form-element", defaultValue: "" }))),
                React.createElement("footer", { className: "submit-bar clear m-t-24" },
                    React.createElement("button", { type: "button", className: "btn success oi", "data-glyph": "circle-check" }, "\u78BA\u8A8D\u5132\u5B58"),
                    React.createElement("button", { type: "button", className: "btn warning oi", "data-glyph": "circle-x" }, "\u56DE\u5217\u8868"))));
        return out_html;
    }
}
const ComToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    };
};
const ComDispatch = (dispatch, ownProps) => {
    return {};
};
let GridView = react_redux_1.connect(ComToProps, ComDispatch)(Grid);
const store = cbnReduce_1.default({ menudata: reducers_1.menudata });
