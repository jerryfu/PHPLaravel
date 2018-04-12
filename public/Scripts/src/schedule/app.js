"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const addMaster_1 = require("../inc/addMaster");
const OrderButton_1 = require("../../comm/OrderButton");
const com_datepick_1 = require("../../comm/com-datepick");
const com_datetimepick_1 = require("../../comm/com-datetimepick");
const comm_modal_1 = require("../../comm/comm-modal");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const defData_1 = require("../../comm/defData");
const tableRecords_1 = require("./tableRecords");
class TopNode extends React.Component {
    constructor() {
        super();
        this.onCompleteChange = this.onCompleteChange.bind(this);
        this.state = {};
    }
    onCompleteChange(e) {
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
        this.selHome = null;
        this.chgQryVal = this.chgQryVal.bind(this);
        this.packSearch = this.packSearch.bind(this);
        this.clkSearch = this.clkSearch.bind(this);
        this.callPage = this.callPage.bind(this);
        this.callEdit = this.callEdit.bind(this);
        this.clkAdd = this.clkAdd.bind(this);
        this.setSort = this.setSort.bind(this);
        this.reloadQuery = this.reloadQuery.bind(this);
        this.callRemove = this.callRemove.bind(this);
        this.clkSet = this.clkSet.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.frmState = this.frmState.bind(this);
        this.frmArea = this.frmArea.bind(this);
        this.keep_search = {};
        this.keep_field = null;
        this.keep_sort = null;
        this.state = {
            isOpenRecords: false,
            teamOption: {
                home: [], visiting: []
            },
            editRecordToogle: 'Home'
        };
        this.chgRecordVal = this.chgRecordVal.bind(this);
        this.clkSaveRecord = this.clkSaveRecord.bind(this);
        this.clkRecordToogle = this.clkRecordToogle.bind(this);
        this.chgScheduleVal = this.chgScheduleVal.bind(this);
        this.addPlayerToSchedule = this.addPlayerToSchedule.bind(this);
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
        if (confirm(`${lang.delete_sure}刪除後會將會連賽程紀錄一起刪除!`)) {
            this.props.callRemove(id);
            this.reloadQuery(null);
        }
    }
    clkSet(id, e) {
        let pp = this.props;
        this.setState({ isOpenRecords: true });
        pp.loadRecord(id);
    }
    modalClose(e) {
        this.setState({ isOpenRecords: false });
    }
    afterOpenModal() {
    }
    chgScheduleVal(name, value, e) {
        let struct = null;
        struct = {
            field: {
                [name]: {
                    $set: value
                }
            }
        };
        let n_state = update(this.props.records, struct);
        this.props.setRecordValue(n_state);
    }
    chgRecordVal(editRecordToogle, id, name, value, e) {
        let struct = null;
        let { records } = this.props;
        if (editRecordToogle == 'Home') {
            let i = records.home.data.findIndex(x => x.player_id == id);
            struct = {
                home: {
                    data: {
                        [i]: {
                            [name]: {
                                $set: value
                            }
                        }
                    }
                }
            };
        }
        if (editRecordToogle == 'Visiting') {
            let i = records.visiting.data.findIndex(x => x.player_id == id);
            struct = {
                visiting: {
                    data: {
                        [i]: {
                            [name]: {
                                $set: value
                            }
                        }
                    }
                }
            };
        }
        let n_state = update(this.props.records, struct);
        pub_1.store.dispatch(pub_1.setRecordValue(n_state));
    }
    clkSaveRecord(e) {
        let pp = this.props;
        let records = pp.records;
        if (!records.field.state.trim()) {
            alert('請設定「比賽狀態設定」！');
            return;
        }
        this.props.saveRecord(records);
    }
    clkRecordToogle(name, e) {
        this.setState({ editRecordToogle: name });
    }
    frmState(code) {
        if (code == 'F')
            return React.createElement("span", { className: "label-success" }, "\u6BD4\u8CFD\u5B8C\u6210");
        else if (code == 'C')
            return React.createElement("span", { className: "label-muted" }, "\u53D6\u6D88");
        else if (code == 'W')
            return React.createElement("span", { className: "label-info" }, "\u9810\u5B9A\u4E2D");
        else
            return React.createElement("span", { className: "label" }, "No Use");
    }
    frmArea(code) {
        if (code == 'N')
            return React.createElement("span", null, "\u5317\u5340");
        else if (code == 'S')
            return React.createElement("span", null, "\u5357\u5340");
        else
            return React.createElement("span", null, "No Use");
    }
    addPlayerToSchedule(player_id, player_name, jersey_number, team_name) {
        let { editRecordToogle } = this.state;
        pub_1.store.dispatch(pub_1.addPlayerToSchedule(editRecordToogle, player_id, player_name, jersey_number, team_name));
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
        let sh = pp.search;
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" }, this.props.menu_name),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "plus", onClick: this.clkAdd }, lang.add)),
            React.createElement("header", { className: "table-head form-inline" },
                React.createElement("div", { className: "form-inline" },
                    React.createElement("label", null, "\u5E74\u5EA6"),
                    React.createElement(components_1.SelectText, { onChange: this.chgQryVal.bind(this, 'workYear'), options: [{ value: 2017, label: '2017' }, { value: 2018, label: '2018' }], is_blank: true, value: sh.workYear }),
                    React.createElement("label", null, "\u65E5\u671F"),
                    React.createElement(com_datepick_1.DatePickText, { inputClassName: "form-element", inputViewMode: 1, value: sh.schedule_start_date, required: true, onChange: this.chgQryVal.bind(this, 'schedule_start_date') }),
                    "~",
                    React.createElement(com_datepick_1.DatePickText, { inputClassName: "form-element", inputViewMode: 1, value: sh.schedule_end_date, required: true, onChange: this.chgQryVal.bind(this, 'schedule_end_date') }),
                    React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgQryVal.bind(this, 'keyword'), value: sh.keyword, placeholder: "請輸入關鍵字" }))),
            React.createElement("table", { className: "table-list table-hover table-striped" },
                React.createElement("colgroup", null,
                    React.createElement("col", { span: 7 }),
                    React.createElement("col", { span: 2, style: { width: '12%' } }),
                    React.createElement("col", null),
                    React.createElement("col", { style: { width: '10%' } })),
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "item-edit" }, lang.delete),
                        React.createElement("th", { className: "item-edit" }, lang.modify),
                        React.createElement("th", { className: "text-left" }, "\u5834\u6B21"),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "日期", field: 'set_date', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "場地", field: 'Site.site_name', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "區域", field: 'PlayDivide.area_sn', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "分組", field: 'PlayDivide.divide_name', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "主隊", field: 'home_team_id', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: "客隊", field: 'visiting_team_id', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "比賽狀態", field: 'state', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null, "\u8A2D\u5B9A\u6BD4\u8CFD\u8A18\u9304"))),
                React.createElement("tbody", null,
                    row_data.map((item, i) => {
                        return React.createElement("tr", { key: item.schedule_id },
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-danger oi", title: lang.delete, dataGlyph: "trash", onClick: this.callRemove.bind(this, item.schedule_id) })),
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-success oi", title: lang.modify, dataGlyph: "pencil", onClick: this.callEdit.bind(this, item.schedule_id) })),
                            React.createElement("td", { className: "text-left" }, item.sno),
                            React.createElement("td", { className: "text-left" }, comm_func_1.stdDate(item.set_date) + ' ' + comm_func_1.stdTime(item.set_date)),
                            React.createElement("td", { className: "text-left" }, item.site_name),
                            React.createElement("td", null, this.frmArea(item.area_sn)),
                            React.createElement("td", null, item.divide_name),
                            React.createElement("td", { className: "text-left" }, item.home_team),
                            React.createElement("td", { className: "text-left" }, item.visiting_team),
                            React.createElement("td", null, this.frmState(item.state)),
                            React.createElement("td", null,
                                React.createElement(components_1.PWButton, { className: "hover-info oi", title: lang.modify, dataGlyph: "flag", onClick: this.clkSet.bind(this, item.schedule_id) }, "\u8A2D\u5B9A")));
                    }),
                    row_empty.map((item, i) => {
                        return React.createElement("tr", { key: 'empty_row_' + i },
                            React.createElement("td", { colSpan: 11 }, "\u00A0"));
                    }))),
            React.createElement(components_1.PageFooter, { search: pp.search, page_grid: pp.page_grid, callPage: this.props.callPage }),
            React.createElement(comm_modal_1.default, { isOpen: st.isOpenRecords, contentLabel: "Modal", onAfterOpen: this.afterOpenModal, onRequestClose: this.modalClose, className: defData_1.config.modalMd, overlayClassName: defData_1.config.modalOverlay },
                React.createElement(components_1.PWButton, { type: "button", onClick: this.modalClose, className: defData_1.config.modalClose }, lang.close),
                React.createElement("section", { className: "modal-content animate-top py-32" },
                    React.createElement("header", { className: "px-16 mb-16 clearfix text-left" },
                        React.createElement("div", { className: "btn-group pull-left" },
                            pp.records.home ?
                                React.createElement(components_1.PWButton, { type: "button", className: "btn warning oi", "data-glyph": "star", onClick: this.clkRecordToogle.bind(this, 'Home') }, '主隊:' + pp.records.home.team_name) : React.createElement("span", null),
                            pp.records.visiting ?
                                React.createElement(components_1.PWButton, { type: "button", className: "btn danger oi", "data-glyph": "fire", onClick: this.clkRecordToogle.bind(this, 'Visiting') }, '客隊:' + pp.records.visiting.team_name) : React.createElement("span", null)),
                        React.createElement("div", { className: "form-inline pull-right" },
                            React.createElement("label", null, "\u6BD4\u8CFD\u72C0\u614B\u8A2D\u5B9A"),
                            React.createElement(components_1.SelectText, { is_blank: true, value: pp.records.field.state, options: [
                                    { label: '預定中', value: 'W' },
                                    { label: '取消', value: 'C' },
                                    { label: '比賽完成', value: 'F' },
                                ], inputViewMode: 1, onChange: this.chgScheduleVal.bind(this, 'state') }),
                            React.createElement(components_1.PWButton, { type: "button", className: "btn success oi ml-16", "data-glyph": "check", onClick: this.clkSaveRecord }, lang.save))),
                    React.createElement("main", { className: "px-16" }, pp.records.home && pp.records.visiting ?
                        React.createElement(tableRecords_1.default, { records: st.editRecordToogle == 'Home' ? pp.records.home : pp.records.visiting, chgFldVal: this.chgRecordVal.bind(this, st.editRecordToogle), addPlayerToSchedule: this.addPlayerToSchedule })
                        : React.createElement("span", null, "\u7403\u968A\u672A\u8A2D\u5B9A\u7403\u54E1")))));
        return out_html;
    }
}
class Edit extends React.Component {
    constructor() {
        super();
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.chgPlayNameVal = this.chgPlayNameVal.bind(this);
        this.chgHomeTeamVal = this.chgHomeTeamVal.bind(this);
        this.frmArea = this.frmArea.bind(this);
        this.state = {
            option_visitteam: [],
            option_hometeam: []
        };
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.edit_type == 0 && nextProps.edit_type == 2) {
            this.setTeamOption(nextProps.field.play_name_id, nextProps.field.home_team_id);
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
    chgPlayNameVal(name, value, e) {
        let input = e.target;
        let struct = {
            [name]: { $set: value },
            home_team_id: { $set: null },
            visiting_team_id: { $set: null }
        };
        let home = this.setHomeTeamOption(value);
        this.setState({ option_hometeam: home, option_visitteam: [] });
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    chgHomeTeamVal(name, value, e) {
        let input = e.target;
        let struct = {
            [name]: { $set: value },
            visiting_team_id: { $set: null }
        };
        let visit = this.setVisitTeamOption(this.state.option_hometeam, value);
        this.setState({ option_visitteam: visit });
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    setTeamOption(play_name_id, hometeam_id) {
        let home = this.setHomeTeamOption(play_name_id);
        let visit = this.setVisitTeamOption(home, hometeam_id);
        this.setState({ option_hometeam: home, option_visitteam: visit });
    }
    setHomeTeamOption(play_name_id) {
        let result = [];
        let playname_list = this.props.pack_option.option_team.filter(x => x.play_name_id == play_name_id);
        if (playname_list.length > 0) {
            let home = playname_list[0].team;
            result = home;
        }
        return result;
    }
    setVisitTeamOption(home, hometeam_id) {
        let result = [];
        let obj = home.filter(x => x.team_id == hometeam_id);
        if (obj.length > 0) {
            let visit = home
                .filter(x => x.area_sn == obj[0].area_sn && x.divide_name == obj[0].divide_name && x.team_id != hometeam_id);
            if (visit.length >= 0) {
                result = visit;
            }
        }
        return result;
    }
    submit(e) {
        e.preventDefault();
        let id = this.props.field.schedule_id;
        this.props.submitData(id, this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
        this.props.returnGrid();
    }
    frmArea(code) {
        if (code == 'N')
            return "北區";
        else if (code == 'S')
            return "南區";
        else
            return "";
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
            React.createElement("div", { className: "alert-warning mb-16" },
                React.createElement("strong", null, "\u5E74\u5EA6:"),
                " \u8ACB\u81F3 [\u7CFB\u7D71\u8A2D\u5B9A]> [\u53C3\u6578\u7BA1\u7406] \u8A2D\u5B9A\u7576\u5E74\u5EA6",
                React.createElement("br", null),
                React.createElement("strong", null, "\u6BD4\u8CFD\u8A18\u9304:"),
                " \u6BD4\u8CFD\u8A18\u9304\u8A2D\u5B9A\u5B8C\u7562\u5F8C\u7121\u6CD5\u4FEE\u6539\"\u5E74\u5EA6\"\u3001\"\u4E3B\u968A\"\u3001\"\u5BA2\u968A\""),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5834\u6B21"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'sno'), value: pp.field.sno, required: true, maxLength: 20 }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u65E5\u671F"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(com_datetimepick_1.default, { value: pp.field.set_date, onChange: this.chgFldVal.bind(this, 'set_date') }),
                        React.createElement("small", { className: "text-danger" }, "\u683C\u5F0F: 2017-08-01 17:00"))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5E74\u5EA6"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgPlayNameVal.bind(this, 'play_name_id'), options: pp.pack_option.option_play_name.optMake(x => x.playname_id, y => y.play_name), is_blank: true, value: pp.field.play_name_id, required: true, disabled: pp.field.hasRecords }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5834\u5730"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'site_id'), options: pp.pack_option.option_site.optMake(x => x.site_id, x => x.site_name), is_blank: true, value: pp.field.site_id, required: true }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u4E3B\u968A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgHomeTeamVal.bind(this, 'home_team_id'), options: this.state.option_hometeam.optMake(x => x.team_id, x => `${this.frmArea(x.area_sn)}${x.divide_name}-${x.team_name}`), is_blank: true, value: pp.field.home_team_id, required: true, disabled: pp.field.hasRecords }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5BA2\u968A"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'visiting_team_id'), options: this.state.option_visitteam.optMake(x => x.team_id, x => `${this.frmArea(x.area_sn)}${x.divide_name}-${x.team_name}`), is_blank: true, value: pp.field.visiting_team_id, required: true, disabled: pp.field.hasRecords }))),
                React.createElement("footer", { className: "submit-bar clear mt-24" },
                    React.createElement(components_1.PWButton, { type: "submit", className: "btn success oi", dataGlyph: "circle-check" }, lang.save),
                    React.createElement(components_1.PWButton, { type: "button", className: "btn warning oi", dataGlyph: "circle-x", onClick: this.cancel }, lang.return_list))));
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
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id,
        pack_option: state.pack_option,
        records: state.records
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
        setPage: pub_1.setPage,
        loadRecord: pub_1.loadRecord,
        addRecord: pub_1.addRecord,
        setRecordValue: pub_1.setRecordValue,
        saveRecord: pub_1.saveRecord
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
        pack_option: state.pack_option
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
