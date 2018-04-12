"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const react_dom_1 = require("react-dom");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const addMaster_1 = require("../inc/addMaster");
const OrderButton_1 = require("../../comm/OrderButton");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const ajax_1 = require("../../comm/ajax");
const api_1 = require("../../comm/api");
let ItemTypes = {
    GoalSort: 'A',
    AreaMove: 'B'
};
const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};
const poolAreaSource = {
    beginDrag(props) {
        return {
            id: props.item.team_id,
            index: props.index
        };
    },
};
const fromPoolAreaTarget = {
    hover(props, monitor, component) {
        if (monitor.isOver()) {
            let obj = monitor.getItem();
            if (obj.kind == 'A') {
            }
            else {
            }
        }
    },
    drop(props, monitor, component) {
        var i = monitor.getItem().index;
        props.add(i, null);
    }
};
const goalAreaSource = {
    beginDrag(props) {
        mlog('goalAreaSource', 'beginDrag', 'run');
        return {
            id: props.id,
            index: props.index
        };
    },
};
const goalAreaTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        let getItem = monitor.getItem();
        let item_type = monitor.getItemType();
        if (item_type == ItemTypes.AreaMove) {
            mlog('hover 左...', 'dragIndex source', dragIndex, 'hoverIndex', hoverIndex);
        }
        if (item_type == ItemTypes.GoalSort) {
            mlog('hover 左...', 'dragIndex source', dragIndex, 'hoverIndex', hoverIndex);
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = react_dom_1.findDOMNode(component).getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            props.moveCard(dragIndex, hoverIndex);
            monitor.getItem().index = hoverIndex;
        }
    },
    drop(props, monitor, component) {
        mlog('drop 左...');
        props.sortRedo();
    }
};
class Container extends React.Component {
    render() {
        let pp = this.props;
        return React.createElement("fieldset", { className: "col-6" },
            React.createElement("legend", { className: "bg-dark text-white p-8" }, "\u5DF2\u52A0\u5165\u968A\u4F0D"),
            pp.teams.map((item, i) => {
                return React.createElement(TeamItem, { item: item, key: item.team_id, moveCard: this.props.sortTeam, sortRedo: this.props.sortRedo, id: item.team_id, index: i, remove: pp.remove.bind(this, i) });
            }));
    }
}
let TeamItem = class TeamItem extends React.Component {
    render() {
        const { isDragging, connectDragSource, connectDropTarget, remove } = this.props;
        let item = this.props.item;
        let i = this.props.index;
        const opacity = isDragging ? 0 : 1;
        return connectDragSource(connectDropTarget(React.createElement("dl", { className: "cells mb-8", id: 'myId' + item.team_id, key: item.team_id, style: Object.assign({}, style, { opacity }) },
            React.createElement("dt", { className: "cell w-75 bg-light px-8" }, item.team_name),
            React.createElement("dd", { className: "cell w-25" },
                React.createElement("button", { className: "btn danger w-100 oi", "data-glyph": "arrow-right", onClick: remove }, "\u79FB\u9664")))));
    }
};
TeamItem = __decorate([
    react_dnd_1.DropTarget([ItemTypes.GoalSort, ItemTypes.AreaMove], goalAreaTarget, connect => ({
        connectDropTarget: connect.dropTarget(),
    })),
    react_dnd_1.DragSource(ItemTypes.GoalSort, goalAreaSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }))
], TeamItem);
let TeamSource = class TeamSource extends React.Component {
    render() {
        const { isDragging, connectDragSource, add } = this.props;
        let item = this.props.item;
        let i = this.props.index;
        const opacity = isDragging ? 0 : 1;
        return connectDragSource(React.createElement("dl", { className: "cells mb-8", key: item.team_id, style: Object.assign({}, style, { opacity }) },
            React.createElement("dt", { className: "cell w-75 bg-light px-8" }, item.team_name),
            React.createElement("dd", { className: "cell w-25" },
                React.createElement("button", { type: "button", className: "btn success w-100 oi", "data-glyph": "arrow-left", onClick: add.bind(this, i) }, "\u52A0\u5165"))));
    }
};
TeamSource = __decorate([
    react_dnd_1.DragSource(ItemTypes.AreaMove, poolAreaSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }))
], TeamSource);
let option_playname = [];
let option_yy = [];
let option_area = [];
class TopNode extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        let pp = this.props;
        console.log('check type', pp.edit_type);
        if (pp.edit_type == 0)
            return React.createElement(GridView, null);
        if (pp.edit_type == 2 || pp.edit_type == 1)
            return React.createElement(EditView, null);
        if (pp.edit_type == 3)
            return React.createElement(SetTeamView, null);
    }
}
const textArea = (code) => {
    if (code == 'N')
        return '北區';
    else if (code == 'S')
        return '南區';
    else
        return null;
};
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
        this.cleSetTeam = this.cleSetTeam.bind(this);
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
    cleSetTeam(play_divide_id, e) {
        this.props.editTeam(play_divide_id);
    }
    frmArea(code) {
        return React.createElement("label", null, textArea(code));
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
                React.createElement("strong", null, "\u522A\u9664:"),
                " \u8ACB\u5148\u79FB\u9664\u968A\u4F0D\u5F8C\u624D\u53EF\u522A\u9664"),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "plus", onClick: this.clkAdd }, lang.add)),
            React.createElement("header", { className: "table-head form-inline" },
                React.createElement("label", null, "\u5E74\u5EA6"),
                React.createElement(components_1.SelectText, { onChange: this.chgQryVal.bind(this, 'yy'), options: option_yy.optMake(x => x, y => y), is_blank: true, value: pp.search.yy }),
                React.createElement("label", null, "\u5340\u5225"),
                React.createElement(components_1.SelectText, { onChange: this.chgQryVal.bind(this, 'area'), options: option_area, is_blank: true, blank_text: "全部", value: pp.search.area }),
                React.createElement("label", null, "\u5206\u7D44"),
                React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgQryVal.bind(this, 'keyword'), value: pp.search.keyword, placeholder: "分組名稱" })),
            React.createElement("table", { className: "table-list table-hover table-striped" },
                React.createElement("colgroup", null,
                    React.createElement("col", { span: 3 }),
                    React.createElement("col", { style: { width: '18%' } }),
                    React.createElement("col", { span: 3, style: { width: '14%' } })),
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "item-edit" }, lang.delete),
                        React.createElement("th", { className: "item-edit" }, lang.modify),
                        React.createElement("th", { className: "text-left" }, "\u5E74\u5EA6\u540D\u7A31"),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "區別", field: 'area_sn', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: "分組名稱", field: 'divide_name', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.setSort })),
                        React.createElement("th", null, "\u968A\u4F0D\u6578\u91CF"),
                        React.createElement("th", null, "\u8A2D\u5B9A\u968A\u4F0D"))),
                React.createElement("tbody", null,
                    row_data.map((item, i) => {
                        return React.createElement("tr", { key: item.play_divide_id },
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-danger oi", title: lang.delete, dataGlyph: "trash", onClick: this.callRemove.bind(this, item.play_divide_id) })),
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-success oi", title: lang.modify, dataGlyph: "pencil", onClick: this.callEdit.bind(this, item.play_divide_id) })),
                            React.createElement("td", { className: "text-left" }, item.play_name),
                            React.createElement("td", null, this.frmArea(item.area_sn)),
                            React.createElement("td", null, item.divide_name),
                            React.createElement("td", null, item.team_count),
                            React.createElement("td", null,
                                React.createElement(components_1.PWButton, { className: "hover-info oi", title: '設定', dataGlyph: "transfer", onClick: this.cleSetTeam.bind(this, item.play_divide_id) })));
                    }),
                    row_empty.map((item, i) => {
                        return React.createElement("tr", { key: 'empty_row_' + i },
                            React.createElement("td", { colSpan: 7 }, "\u00A0"));
                    }))),
            React.createElement(components_1.PageFooter, { search: pp.search, page_grid: pp.page_grid, callPage: this.props.callPage }));
        return out_html;
    }
}
let SetTeam = class SetTeam extends React.Component {
    constructor() {
        super();
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.submit = this.submit.bind(this);
        this.sortItem = this.sortItem.bind(this);
        this.sortRedo = this.sortRedo.bind(this);
        this.state = {};
    }
    add(i, e) {
        let obj = this.props.set_play_team;
        let get_item = this.props.set_play_team.teamNotSet[i];
        let additem = {
            play_divide_team_id: 0,
            play_divide_id: obj.play_divide_id,
            team_id: get_item.team_id,
            team_name: get_item.team_name,
            sort: 0
        };
        let struct = {
            teamDivSet: { $push: [additem] },
            teamNotSet: { $splice: [[i, 1]] }
        };
        let n_state = update(this.props.set_play_team, struct);
        this.props.setSelectTeam(n_state);
    }
    addTemp(i, e) {
        let obj = this.props.set_play_team;
        let get_item = this.props.set_play_team.teamNotSet[i];
        let additem = {
            play_divide_team_id: 0,
            play_divide_id: obj.play_divide_id,
            team_id: get_item.team_id,
            team_name: get_item.team_name,
            sort: 0
        };
        let struct = {
            teamDivSet: { $push: [additem] },
            teamNotSet: { $splice: [[i, 1]] }
        };
        let n_state = update(this.props.set_play_team, struct);
        this.props.setSelectTeam(n_state);
    }
    remove(i, e) {
        let obj = this.props.set_play_team;
        let get_item = this.props.set_play_team.teamDivSet[i];
        let removeitem = {
            team_id: get_item.team_id,
            team_name: get_item.team_name
        };
        let struct = {
            teamNotSet: { $push: [removeitem] },
            teamDivSet: { $splice: [[i, 1]] }
        };
        let n_state = update(this.props.set_play_team, struct);
        this.props.setSelectTeam(n_state);
    }
    submit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let pp = this.props;
            let data = yield ajax_1.ft(api_1.default.POST__api_PlayDivideTeam, pp.set_play_team);
            if (data.state == 0) {
                comm_func_1.tosMessage('', lang.fi_update, 1);
            }
        });
    }
    sortItem(dragIndex, hoverIndex) {
        const set_teams = this.props.set_play_team.teamDivSet;
        const dragCard = set_teams[dragIndex];
        let n_state = update(this.props.set_play_team, {
            teamDivSet: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }
        });
        this.props.sortTeam(n_state);
    }
    sortRedo() {
        const { set_play_team } = this.props;
        let p = {
            teamDivSet: {}
        };
        for (var i = 0; i < set_play_team.teamDivSet.length; i++) {
            p.teamDivSet[i] = {
                sort: { $set: i }
            };
        }
        let n_state = update(this.props.set_play_team, p);
        this.props.sortRedo(n_state);
    }
    render() {
        let pp = this.props;
        let st = this.state;
        return React.createElement("div", null,
            React.createElement("h3", { className: "title" },
                " ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u8A2D\u5B9A\u968A\u4F0D")),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "check", onClick: this.submit }, lang.save),
                React.createElement(components_1.PWButton, { className: "btn warning oi", dataGlyph: "chevron-left", onClick: pp.returnGrid }, lang.return_list)),
            React.createElement("h4", null,
                pp.set_play_team.play_name,
                ".",
                textArea(pp.set_play_team.area_sn),
                ".",
                pp.set_play_team.divide_name),
            React.createElement("div", { className: "row row-x0" },
                React.createElement(Container, { teams: pp.set_play_team.teamDivSet, sortTeam: this.sortItem, sortRedo: this.sortRedo, remove: this.remove, add: this.add }),
                React.createElement("fieldset", { className: "col-6" },
                    React.createElement("legend", { className: "bg-dark text-white p-8" }, "\u672A\u52A0\u5165\u968A\u4F0D"),
                    pp.set_play_team.teamNotSet.map((item, i) => {
                        return (React.createElement(TeamSource, { key: item.team_id, add: this.add.bind(this, i), item: item, sortTeam: this.sortItem, sortRedo: this.sortRedo, index: i }));
                    }))));
    }
};
SetTeam = __decorate([
    react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default),
    __metadata("design:paramtypes", [])
], SetTeam);
class Edit extends React.Component {
    constructor() {
        super();
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.state = {
            option_prodkind: []
        };
    }
    componentDidMount() {
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
        let id = this.props.field.play_divide_id;
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
            React.createElement("div", { className: "alert-warning mb-16" },
                React.createElement("strong", null, "\u5E74\u5EA6\u540D\u7A31:"),
                " \u8ACB\u81F3 [\u7CFB\u7D71\u8A2D\u5B9A]> [\u53C3\u6578\u7BA1\u7406] \u8A2D\u5B9A\u7576\u5E74\u5EA6"),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5E74\u5EA6\u540D\u7A31"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'play_name_id'), options: option_playname.optMake(x => x.playname_id, x => x.play_name), is_blank: true, value: pp.field.play_name_id, required: true }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u5340\u5225"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.SelectText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'area_sn'), options: option_area, is_blank: true, value: pp.field.area_sn, required: true }))),
                React.createElement("dl", { className: "field" },
                    React.createElement("dt", { className: "col-2" }, "\u7D44\u5225\u540D\u7A31"),
                    React.createElement("dd", { className: "col-5" },
                        React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'divide_name'), value: pp.field.divide_name, required: true, maxLength: 60 }))),
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
        setPage: pub_1.setPage,
        editTeam: pub_1.editTeam
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
const SetTeamToProps = (state, ownProps) => {
    let menu = comm_func_1.getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        set_play_team: state.set_play_team
    };
};
const SetTeamDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        returnGrid: pub_1.returnGrid,
        setSelectTeam: pub_1.setSelectTeam,
        submitTeam: pub_1.submitTeam,
        editTeam: pub_1.editTeam,
        sortTeam: pub_1.sortTeam,
        sortRedo: pub_1.sortRedo
    }, dispatch);
    return s;
};
let SetTeamView = react_redux_1.connect(SetTeamToProps, SetTeamDispatch)(SetTeam);
function Start() {
    return __awaiter(this, void 0, void 0, function* () {
        let data1 = yield ajax_1.ft(api_1.default.GET__api_PlayName_Option, {});
        let data2 = yield ajax_1.ft(api_1.default.GET__api_Utility_GetYY, {});
        option_playname = data1.data;
        option_yy = data2;
        option_area = [{ label: "北區", value: "N" }, { label: "南區", value: "S" }];
        addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);
    });
}
Start();
