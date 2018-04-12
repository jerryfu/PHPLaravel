"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const addMaster_1 = require("../inc/addMaster");
const OrderButton_1 = require("../../comm/OrderButton");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const com_datepick_1 = require("../../comm/com-datepick");
const comm_superselect_1 = require("../../comm/comm-superselect");
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
        this.dwExcel = this.dwExcel.bind(this);
        this.keep_search = {};
        this.keep_field = null;
        this.keep_sort = null;
        this.state = {};
    }
    componentDidMount() {
        this.props.callLoad();
    }
    componentDidUpdate(prevProps, prevState) {
        let { oper_id } = this.props;
        if (prevProps.oper_id != oper_id) {
            this.reloadQuery(null);
        }
    }
    chgQryVal(name, value, e) {
        this.props.setQueryValue(name, value);
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
    frmState(code) {
        if (code == 'A')
            return React.createElement("span", { className: "label-success" }, "\u555F\u7528");
        else if (code == 'C')
            return React.createElement("span", { className: "label-muted" }, "\u505C\u6B62");
        else
            return React.createElement("span", { className: "label" }, "No Use");
    }
    dwExcel(e) {
        e.preventDefault();
        let url_pm = '';
        let pm = {
            tid: comm_func_1.tim()
        };
        $.extend(pm, this.props.search);
        url_pm = $.param(pm);
        let src = gb_approot + "Base/ExcelReport/Excel_Player?" + url_pm;
        comm_func_1.ifrmDown(src);
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
                " \u4F9D\u540D\u7A31\u6392\u5E8F"),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "plus", onClick: this.clkAdd }, lang.add)),
            React.createElement("header", { className: "table-head form-inline" },
                React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgQryVal.bind(this, 'keyword'), value: pp.search.keyword, placeholder: "請輸入關鍵字" }),
                React.createElement("label", null, "\u7403\u968A"),
                React.createElement(components_1.SelectText, { onChange: this.chgQryVal.bind(this, 'team_id'), options: pp.option_team.optMake(x => x.team_id, x => x.team_name), is_blank: true, value: pp.search.team_id }),
                React.createElement(components_1.PWButton, { type: "button", className: "btn success oi", dataGlyph: "print", onClick: this.dwExcel }, lang.print)),
            React.createElement("table", { className: "table-list table-hover table-striped" },
                React.createElement("colgroup", null,
                    React.createElement("col", { span: 2 }),
                    React.createElement("col", { style: { width: '24%' } }),
                    React.createElement("col", null),
                    React.createElement("col", { style: { width: '12%' } })),
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "item-edit" }, lang.delete),
                        React.createElement("th", { className: "item-edit" }, lang.modify),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "身分證字號", field: 'idno', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "姓名", field: 'team_id', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "球隊", field: 'team_id', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null, "\u72C0\u614B"))),
                React.createElement("tbody", null,
                    row_data.map((item, i) => {
                        return React.createElement("tr", { key: item.player_id },
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-danger oi", title: lang.delete, dataGlyph: "trash", onClick: this.callRemove.bind(this, item.player_id) })),
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-success oi", title: lang.modify, dataGlyph: "pencil", onClick: this.callEdit.bind(this, item.player_id) })),
                            React.createElement("td", { className: "text-left" }, item.idno),
                            React.createElement("td", { className: "text-left" }, item.player_name),
                            React.createElement("td", { className: "text-left" }, item.team_name),
                            React.createElement("td", null, this.frmState(item.state)));
                    }),
                    row_empty.map((item, i) => {
                        return React.createElement("tr", { key: 'empty_row_' + i },
                            React.createElement("td", { colSpan: 6 }, "\u00A0"));
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
        this.state = {
            option_team: []
        };
    }
    componentDidMount() {
    }
    chgFldVal(name, value, e) {
        this.props.setInputValue(name, value);
    }
    submit(e) {
        e.preventDefault();
        let id = this.props.field.player_id;
        if (!this.props.field.team_id) {
            alert("請選擇所屬球隊!");
            return;
        }
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
        var Toptions = pp.option_team.map(x => { return { id: x.team_id, name: x.team_name }; });
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" },
                this.props.menu_name,
                " ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u7403\u968A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(comm_superselect_1.ReactAutoSelectText, { onChange: this.chgFldVal.bind(this, 'team_id'), options: Toptions, value: pp.field.team_id }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u59D3\u540D"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'player_name'), value: pp.field.player_name, required: true, maxLength: 60 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u80CC\u865F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'jersey_number'), value: pp.field.jersey_number, required: false, maxLength: 60 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u8EAB\u5206\u8B49\u5B57\u865F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'idno'), value: pp.field.idno, required: true, maxLength: 11 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u72C0\u614B"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.RadioText, { inputClassName: 'radio', id: 'state_0', value: 'A', checked: pp.field.state == 'A', inputViewMode: 1, onClick: this.chgFldVal.bind(this, 'state') }),
                        React.createElement("label", { htmlFor: "state_0" }),
                        "\u555F\u7528",
                        React.createElement(components_1.RadioText, { inputClassName: 'radio', id: 'state_1', value: 'C', checked: pp.field.state == 'C', inputViewMode: 1, onClick: this.chgFldVal.bind(this, 'state') }),
                        React.createElement("label", { htmlFor: "state_1" }),
                        "\u505C\u6B62")),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5730\u5740"),
                    React.createElement("dd", { className: "col-10" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'address'), value: pp.field.address, required: false, maxLength: 200 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u96FB\u8A71"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'tel'), value: pp.field.tel, required: false, maxLength: 20 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u8EAB\u9AD8"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("div", { className: "input-group" },
                            React.createElement(components_1.InputNum, { onChange: this.chgFldVal.bind(this, 'height'), value: pp.field.height, required: false, onlyPositive: true }),
                            React.createElement("span", { className: "input-group-addon" }, "\u516C\u5206")))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u9AD4\u91CD"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement("div", { className: "input-group" },
                            React.createElement(components_1.InputNum, { onChange: this.chgFldVal.bind(this, 'weight'), value: pp.field.weight, required: false, onlyPositive: true }),
                            React.createElement("span", { className: "input-group-addon" }, "\u516C\u65A4")))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u751F\u65E5"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(com_datepick_1.DatePickText, { inputClassName: "w-100", inputViewMode: 1, value: pp.field.birthday, required: false, onChange: this.chgFldVal.bind(this, 'birthday') }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u4F4D\u7F6E"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { onChange: this.chgFldVal.bind(this, 'positions'), options: [
                                { label: 'PF(大前鋒)', value: 'PF' },
                                { label: 'SF(小前鋒)', value: 'SF' },
                                { label: 'C(中鋒)', value: 'C' },
                                { label: 'SG(得分後衛)', value: 'SG' },
                                { label: 'PG(控球後衛)', value: 'PG' }
                            ], is_blank: true, required: false, value: pp.field.positions }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u7403\u54E1\u7167\u7247"),
                    React.createElement("dd", { className: "col-5" }, pp.edit_type == 2 ?
                        [React.createElement(components_1.FileUpBtn, { id: pp.field.player_id, fileKey: "player", title: "人像圖上傳", is_img: true }),
                            React.createElement("small", { className: "text-danger" }, "\u80CC\u666F\u8ACB\u53BB\u80CC\u4EE5\u9054\u5230\u6700\u4F73\u700F\u89BD\u6548\u679C (\u80CC\u666F\u900F\u660E \u6216 \u5E95\u8272\u8A2D\u70BA #F6F6F6)")]
                        : React.createElement("span", { className: "text-danger" }, lang.after_insert))),
                React.createElement("footer", { className: "submit-bar clear mt-24" },
                    React.createElement(components_1.PWButton, { type: "submit", className: "btn success oi", dataGlyph: "circle-check" }, lang.save),
                    React.createElement(components_1.PWButton, { type: "button", className: "btn warning oi", dataGlyph: "circle-x", onClick: this.cancel }, lang.return_list))));
        return out_html;
    }
}
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type
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
        oper_id: state.oper_id,
        option_team: state.option_team
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
        callRemove: pub_1.callRemove
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
        field: state.field,
        option_team: state.option_team
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
addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);