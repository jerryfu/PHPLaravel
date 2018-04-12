"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const com_datepick_1 = require("../../comm/com-datepick");
const addMaster_1 = require("../inc/addMaster");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
class TopNode extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return React.createElement("div", null,
            React.createElement(GridView, null));
    }
}
class Grid extends React.Component {
    constructor() {
        super();
        this.chgFldVal = this.chgFldVal.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.state = {};
    }
    componentDidMount() {
        this.props.callLoad();
    }
    chgFldVal(name, value, e) {
        let input = e.target;
        let struct = {
            [name]: { $set: value }
        };
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    submit(e) {
        e.preventDefault();
        this.props.submitData(this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
    }
    render() {
        let out_html = null;
        let { field, menu_name } = this.props;
        let st = this.state;
        out_html = React.createElement("div", null,
            React.createElement("h3", { className: "title" },
                menu_name,
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("div", { className: "alert-warning mb-16" },
                "\u5F71\u7247\u5C07\u6703\u986F\u793A\u5728",
                React.createElement("br", null),
                "1. \u9996\u9801> \u7CBE\u5F69\u82B1\u7D6E\u5340\u584A",
                React.createElement("br", null),
                "2. \u6D3B\u52D5\u82B1\u7D6E> \u5217\u8868\u9801> \u9801\u982D\u5340\u584A"),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u6BD4\u8CFD\u65E5\u671F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(com_datepick_1.DatePickText, { inputViewMode: 1, onChange: this.chgFldVal.bind(this, 'set_date'), value: field.set_date }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u6BD4\u8CFD\u5730\u9EDE"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { onChange: this.chgFldVal.bind(this, 'site_name'), value: field.site_name, required: true, maxLength: 64 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u4E3B\u968A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { onChange: this.chgFldVal.bind(this, 'home_name'), value: field.home_name, required: false, maxLength: 64 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5BA2\u968A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { onChange: this.chgFldVal.bind(this, 'visiting_name'), value: field.visiting_name, required: false, maxLength: 64 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5F71\u7247\u7DB2\u5740"),
                    React.createElement("dd", { className: "col-9" },
                        React.createElement(components_1.InputText, { onChange: this.chgFldVal.bind(this, 'url'), value: field.url, required: false, maxLength: 4000 }),
                        React.createElement("small", { className: "text-danger block" }, "* Youtube\uFF1A\u8ACB\u9EDE\u9078 Youtube \u7684 [\u5206\u4EAB]> [\u5D4C\u5165]> \u8907\u88FD [\u5167\u5D4C\u7A0B\u5F0F\u78BC]"),
                        React.createElement("small", { className: "text-danger block" }, "* FB\uFF1A\u8ACB\u9EDE\u9078 [\u6ED1\u9F20\u53F3\u9375] > [\u986F\u793A\u5F71\u7247\u7DB2\u5740]> \u8907\u88FD [\u7DB2\u5740]"))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u4EE3\u8868\u5716(\u9996\u9801\u7528)"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.FileUpBtn, { id: "index", fileKey: "videopush", title: "圖片上傳", is_img: true }))),
                React.createElement("footer", { className: "submit-bar clear mt-24" },
                    React.createElement("button", { type: "submit", className: "btn success oi", "data-glyph": "circle-check" }, "\u78BA\u8A8D\u5132\u5B58"),
                    React.createElement("button", { type: "button", className: "btn warning oi", "data-glyph": "circle-x", onClick: this.cancel }, "\u53D6\u6D88"))));
        return out_html;
    }
}
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    };
};
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({}, dispatch);
    return s;
};
let TopNodeView = react_redux_1.connect(TopNodeToProps, TopNodeDispatch)(TopNode);
const GridToProps = (state, ownProps) => {
    let menu = comm_func_1.getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        field: state.field,
        kfield: state.kfield
    };
};
const GridDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        setInputValue: pub_1.setInputValue,
        submitData: pub_1.submitData,
        callLoad: pub_1.callLoad,
        cancel: pub_1.cancel
    }, dispatch);
    return s;
};
let GridView = react_redux_1.connect(GridToProps, GridDispatch)(Grid);
addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);
