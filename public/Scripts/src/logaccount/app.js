"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const addMaster_1 = require("../inc/addMaster");
const OrderButton_1 = require("../../comm/OrderButton");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const ajax_1 = require("../../comm/ajax");
const api_1 = require("../../comm/api");
let option_role = [];
class TopNode extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return React.createElement("div", null,
            React.createElement(GridView, null),
            React.createElement(EditView, null));
    }
}
class Grid extends React.Component {
    constructor() {
        super();
        this.chgQryVal = this.chgQryVal.bind(this);
        this.packSearch = this.packSearch.bind(this);
        this.clkSearch = this.clkSearch.bind(this);
        this.callPage = this.callPage.bind(this);
        this.callEdit = this.callEdit.bind(this);
        this.clkAdd = this.clkAdd.bind(this);
        this.setSort = this.setSort.bind(this);
        this.reloadQuery = this.reloadQuery.bind(this);
        this.callRemove = this.callRemove.bind(this);
        this.keep_search = {};
        this.keep_field = null;
        this.keep_sort = null;
        this.state = {};
    }
    componentDidMount() {
        this.props.callLoad();
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props;
        if (prevProps.oper_id != pp.oper_id) {
            this.reloadQuery(null);
        }
    }
    chgQryVal(name, value, e) {
        let input = e.target;
        let struct = {
            [name]: { $set: value }
        };
        let n_state = update(this.props.search, struct);
        this.props.setQueryValue(n_state);
        let structpage = {
            page: { $set: 1 }
        };
        let p_state = update(this.props.page_grid, structpage);
        this.props.setPage(p_state);
    }
    callPage(p) {
        this.props.callPage(p);
    }
    callEdit(id, e) {
        this.props.callEdit(id);
    }
    clkAdd(e) {
        this.props.addState();
    }
    packSearch(p) {
        const r = Object.assign(this.props.search, p);
        return r;
    }
    clkSearch(e) {
        this.keep_search = Object.assign({}, this.props.search);
        var p = this.packSearch({ page: 1 });
        this.props.callPage(p);
    }
    setSort(_field, _sort) {
        this.keep_field = _field;
        this.keep_sort = _sort;
        const p = {
            page: this.props.page_grid.page,
            _sort: _sort,
            _field: _field
        };
        let query_page = this.packSearch(p);
        this.props.callPage(query_page);
    }
    reloadQuery(page) {
        let toPage = page == null ? this.props.page_grid.page : page;
        const p = {
            page: toPage,
            _sort: this.keep_sort,
            _field: this.keep_field
        };
        let query_page = this.packSearch(p);
        this.props.callPage(query_page);
    }
    callRemove(id, e) {
        if (confirm(lang.delete_sure)) {
            this.props.callRemove(id);
            this.reloadQuery(null);
        }
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let st = this.state;
        if (!pp.page_grid)
            return null;
        let row_data = pp.page_grid.rows;
        let row_empty = [];
        for (var i = 0; i < 10 - row_data.length; i++) {
            row_empty.push({});
        }
        let show = pp.edit_type == 0 ? 'block' : 'none';
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" }, this.props.menu_name),
            React.createElement("div", { className: "alert-warning mb-16" },
                React.createElement("strong", null, "\u524D\u53F0\u6392\u5E8F:"),
                "\u6578\u5B57\u6108\u5927\u6108\u524D\u9762"),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "plus", onClick: this.clkAdd }, lang.add)),
            React.createElement("header", { className: "table-head form-inline" },
                React.createElement(components_1.InputText, { onChange: this.chgQryVal.bind(this, 'keyword'), value: pp.search.keyword, placeholder: "請輸入關鍵字" })),
            React.createElement("table", { className: "table-list table-hover table-striped" },
                React.createElement("colgroup", null,
                    React.createElement("col", { span: 2 })),
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "item-edit" }, lang.delete),
                        React.createElement("th", { className: "item-edit" }, lang.modify),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "帳號", field: 'account', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "姓名", field: 'log_name', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "email", field: 'email', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })))),
                React.createElement("tbody", null,
                    row_data.map((item, i) => {
                        return React.createElement("tr", { key: item.account },
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-danger oi", title: lang.delete, dataGlyph: "trash", onClick: this.callRemove.bind(this, item.account) })),
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-success oi", title: lang.modify, dataGlyph: "pencil", onClick: this.callEdit.bind(this, item.account) })),
                            React.createElement("td", { className: "text-left" }, item.account),
                            React.createElement("td", { className: "text-left" }, item.log_name),
                            React.createElement("td", { className: "text-left" }, item.email));
                    }),
                    row_empty.map((item, i) => {
                        return React.createElement("tr", { key: 'empty_row_' + i },
                            React.createElement("td", { colSpan: 11 }, "\u00A0"));
                    }))),
            React.createElement(components_1.PageFooter, { search: pp.search, page_grid: pp.page_grid, callPage: this.props.callPage }));
        return out_html;
    }
}
class Edit extends React.Component {
    constructor() {
        super();
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.state = {};
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.edit_type == 0 && (nextProps.edit_type == 1 || nextProps.edit_type == 2)) {
        }
    }
    chgFldVal(name, value, e) {
        let input = e.target;
        let struct = {
            [name]: { $set: value }
        };
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    chgRoleVal(i, name, value, e) {
        let input = e.target;
        let struct = {
            role_array: {
                [i]: {
                    [name]: { $set: value }
                }
            }
        };
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    chgContext(contentState) {
        this.setState({});
    }
    submit(e) {
        e.preventDefault();
        let id = this.props.field.account;
        this.props.submitData(id, this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
        this.props.returnGrid();
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let st = this.state;
        let show = pp.edit_type == 1 || pp.edit_type == 2 ? 'block' : 'none';
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" },
                this.props.menu_name,
                " ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5E33\u865F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'account'), value: pp.field.account, required: true, disabled: pp.edit_type == 2, maxLength: 30 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u767B\u5165\u540D\u7A31"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'log_name'), value: pp.field.log_name, required: false, maxLength: 200 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "email"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'email'), value: pp.field.email, required: true, maxLength: 200 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5BC6\u78BC"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { type: "password", inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'log_pwd'), value: pp.field.log_pwd, required: true, disabled: pp.edit_type == 2, maxLength: 512 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u9810\u8A2D\u5BC6\u78BC"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { type: "password", inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'def_pwd'), value: pp.field.def_pwd, required: true, disabled: pp.edit_type == 2, maxLength: 512 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u6B0A\u9650"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'role_id'), options: option_role.optMake(x => x.role_id, x => x.role_name), is_blank: false, value: pp.field.role_id, required: true }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5E33\u865F\u72C0\u614B"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.RadioText, { inputClassName: "radio", id: 'state_0', value: 'A', checked: pp.field.state == 'A', inputViewMode: 1, onClick: this.chgFldVal.bind(this, 'state') }),
                        React.createElement("label", { htmlFor: "state_0" }),
                        "\u555F\u7528",
                        React.createElement(components_1.RadioText, { inputClassName: "radio", id: 'state_1', value: 'S', checked: pp.field.state == 'S', inputViewMode: 1, onClick: this.chgFldVal.bind(this, 'state') }),
                        React.createElement("label", { htmlFor: "state_1" }),
                        "\u505C\u7528")),
                React.createElement("footer", { className: "submit-bar fixed-bottom mt-24" },
                    React.createElement(components_1.PWButton, { type: "submit", className: "btn success oi", dataGlyph: "circle-check" }, lang.save),
                    React.createElement(components_1.PWButton, { type: "button", className: "btn warning oi", dataGlyph: "circle-x", onClick: this.cancel }, lang.return_list))));
        return out_html;
    }
}
const GridFloderState = ({ code }) => {
    if (code == true)
        return React.createElement("span", { className: "label-success" }, "\u7236\u9078\u55AE");
    else if (code == false)
        return React.createElement("span", { className: "label-info" }, "\u5B50\u9078\u55AE");
    else
        return React.createElement("span", { className: "label" }, "No");
};
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
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id
    };
};
const GridDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        setInputValue: pub_1.setInputValue,
        setQueryValue: pub_1.setQueryValue,
        callLoad: pub_1.callLoad,
        callPage: pub_1.callPage,
        callEdit: pub_1.callEdit,
        addState: pub_1.addState,
        callRemove: pub_1.callRemove,
        setPage: pub_1.setPage
    }, dispatch);
    return s;
};
let GridView = react_redux_1.connect(GridToProps, GridDispatch)(Grid);
const EditToProps = (state, ownProps) => {
    let menu = comm_func_1.getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        kfield: state.kfield,
        field: state.field
    };
};
const EditDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        setInputValue: pub_1.setInputValue,
        callRemove: pub_1.callRemove,
        cancel: pub_1.cancel,
        returnGrid: pub_1.returnGrid,
        submitData: pub_1.submitData
    }, dispatch);
    return s;
};
let EditView = react_redux_1.connect(EditToProps, EditDispatch)(Edit);
function Start() {
    return __awaiter(this, void 0, void 0, function* () {
        let data1 = yield ajax_1.ft(api_1.default.GET__api_LogRole_Option, {});
        option_role = data1.data;
        addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);
    });
}
Start();
