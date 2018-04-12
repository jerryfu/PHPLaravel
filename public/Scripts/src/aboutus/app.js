"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const addMaster_1 = require("../inc/addMaster");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const com_editor_1 = require("../../comm/com-editor");
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
        this.tabs = this.tabs.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.state = { tab_index: 0 };
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
    tabs(i, e) {
        this.setState({ tab_index: i });
    }
    renderTabs(i) {
        let html = null;
        let fd = this.props.field;
        if (i == 0)
            html = React.createElement(com_editor_1.default, { value: fd.context1, onChange: this.chgFldVal.bind(this, 'context1'), inputClassName: "tab-content" });
        else if (i == 1)
            html = React.createElement(com_editor_1.default, { value: fd.context2, onChange: this.chgFldVal.bind(this, 'context2'), inputClassName: "tab-content" });
        else if (i == 2)
            html = React.createElement(com_editor_1.default, { value: fd.context3, onChange: this.chgFldVal.bind(this, 'context3'), inputClassName: "tab-content" });
        return html;
    }
    render() {
        let out_html = null;
        let { field, menu_name } = this.props;
        let st = this.state;
        out_html = React.createElement("div", null,
            React.createElement("h3", { className: "title" },
                menu_name,
                " ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("nav", { className: "tab" },
                    React.createElement("a", { href: "#tab1", className: 'tab-nav' + (st.tab_index == 0 ? ' active' : ''), onClick: this.tabs.bind(this, 0) }, "TSBA\u7C21\u4ECB"),
                    React.createElement("a", { href: "#tab2", className: 'tab-nav' + (st.tab_index == 1 ? ' active' : ''), onClick: this.tabs.bind(this, 1) }, "\u7AF6\u8CFD\u898F\u7A0B"),
                    React.createElement("a", { href: "#tab3", className: 'tab-nav' + (st.tab_index == 2 ? ' active' : ''), onClick: this.tabs.bind(this, 2) }, "\u5831\u540D\u8CC7\u8A0A")),
                React.createElement("section", { className: "tab-main" }, this.renderTabs(st.tab_index)),
                React.createElement("footer", { className: "submit-bar clear mt-24 fixed-bottom" },
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
