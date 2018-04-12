/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DatePickText } from '../../comm/com-datepick';

import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, AreaText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store, setPage } from './pub'
import { getMenuName, stdDate, tim } from '../../comm/comm-func';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';
import EditorText from '../../comm/com-editor';

//頂端元件
interface TopNodeProps {
    edit_type?: IEditType,
}
class TopNode extends React.Component<TopNodeProps, any>{
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <div><GridView /><EditView /></div>;
    }
}

//列表介面元件
interface GridProps {
    search?: {
        keyword: string,
        state: string,
        day: any
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.Links>,
    callEdit?: Function,
    callRemove?: Function,
    callPage?: Function,
    callLoad?: Function,
    addState?: Function,
    setQueryValue?: Function,
    setPage?: Function
}
class Grid extends React.Component<GridProps, any>{

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

        let pp = this.props

        if (prevProps.oper_id != pp.oper_id) {
            //console.log('trigger reload')
            this.reloadQuery(null);
        }
    }
    keep_search;
    keep_field;
    keep_sort;

    chgQryVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {

        let input: HTMLInputElement = e.target as HTMLInputElement;
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
        this.props.callPage(p)
    }
    callEdit(id, e: React.SyntheticEvent<EventTarget>) {
        this.props.callEdit(id);
    }
    clkAdd(e: React.SyntheticEvent<EventTarget>) {
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
    callRemove(id, e: React.SyntheticEvent<EventTarget>) {
        if (confirm(lang.delete_sure)) {
            this.props.callRemove(id);
            this.reloadQuery(null);
        }
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;

        if (!pp.page_grid)
            return null;

        let row_data = pp.page_grid.rows;

        let row_empty = [];
        for (var i = 0; i < 10 - row_data.length; i++) {
            row_empty.push({});
        }

        let show = pp.edit_type == IEditType.none ? 'block' : 'none';

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name}</h3>
            <div className="alert-warning mb-16">
                <strong>前台排序:</strong>數字愈大愈前面
            </div>
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{lang.add}</PWButton>
            </div>
            <header className="table-head form-inline">
                <InputText
                    inputClassName="form-element"
                    onChange={this.chgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="請輸入關鍵字"
                />
                <label>日期</label>

                <label>前台顯示</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'state')}
                    options={[{ value: 'A', label: '顯示' }, { value: 'S', label: '隱藏' }]}
                    is_blank={true}
                    value={pp.search.state}
                />
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={3} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th className="text-left">
                            <OrderButton title="名稱"
                                field={'title'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="前台排序"
                                field={'sort'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="前台顯示"
                                field={'state'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.links_id}>
                                <td className="item-edit">
                                    <PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.links_id)}>
                                    </PWButton>
                                </td>
                                <td className="item-edit">
                                    <PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.links_id)}>
                                    </PWButton>
                                </td>
                                <td className="text-left">{item.title}</td>
                                <td>{item.sort}</td>
                                <td>{<GridState code={item.state} />}</td>
                            </tr>
                        })
                    }
                    {
                        row_empty.map((item, i) => { //不足列數補空列數
                            return <tr key={'empty_row_' + i}><td colSpan={6}>&nbsp;</td></tr>;
                        })
                    }
                </tbody>
            </table>
            <PageFooter search={pp.search} page_grid={pp.page_grid} callPage={this.props.callPage} />
        </div>;
        return out_html;
    }
}

//編輯資料元件
interface EditProps {
    edit_type?: IEditType
    field?: server.Links
    kfield?: server.Links
    exist?: boolean
    oper_id?: string
    setInputValue?: Function
    cancelState?: Function
    submitData?: Function
    cancel?: Function
    returnGrid?: Function
    menu_name?: string,
}
interface StateProps {
    option_prodkind: SelectTextOptions[],
    //contentState: any
}
class Edit extends React.Component<EditProps, StateProps>{

    constructor() {
        super();
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

        this.state = {
            option_prodkind: [],
        };
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    chgFldVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {

        //console.log('test=>', name, value);

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let struct = {
            [name]: { $set: value }
        };

        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.links_id;
        this.props.submitData(id, this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
        this.props.returnGrid();
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;
        let show = pp.edit_type == IEditType.insert || pp.edit_type == IEditType.modify ? 'block' : 'none';

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>

                <dl className="field">
                    <dt className="col-2">名稱</dt>
                    <dd className="col-9">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'title')}
                            value={pp.field.title}
                            required={true}
                            maxLength={64}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">超連結</dt>
                    <dd className="col-9">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'url')}
                            value={pp.field.url}
                            required={true}
                            maxLength={1000}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">圖片</dt>
                    <dd className="col-5">
                        {
                            pp.edit_type == IEditType.modify ?
                                <FileUpBtn id={pp.field.links_id} fileKey="links_list" title="圖片上傳" is_img={true} />
                                : <span className="text-danger">{lang.after_insert}</span>
                        }
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">排序</dt>
                    <dd className="col-5">
                        <InputNum
                            onChange={this.chgFldVal.bind(this, 'sort')}
                            value={pp.field.sort}
                            required={true}
                        />
                        <small>數字愈大愈前面</small>
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">前台顯示</dt>
                    <dd className="col-4">
                        <RadioText
                            inputClassName="radio"
                            id={'state_0'}
                            value={'A'}
                            checked={pp.field.state == 'A'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_0" />顯示
                                <RadioText
                            inputClassName="radio"
                            id={'state_1'}
                            value={'S'}
                            checked={pp.field.state == 'S'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_1" />隱藏
                     </dd>
                </dl>
                <footer className="submit-bar clear mt-24">
                    <PWButton type="submit" className="btn success oi" dataGlyph="circle-check">
                        {lang.save}
                    </PWButton>{}
                    <PWButton type="button" className="btn warning oi" dataGlyph="circle-x" onClick={this.cancel}>
                        {lang.return_list}
                    </PWButton>
                </footer>
            </form>
        </div>;
        return out_html;
    }
}
const GridState = ({ code }: { code: string }) => {
    if (code == 'A')
        return <span className="label-success">顯示</span>;
    else if (code == 'S')
        return <span className="label-muted">隱藏</span>;
    else
        return <span className="label">No</span>
}
/*=========================Redux連接元件及Action=========================*/
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    }
}
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
    }, dispatch);
    return s;
}
let TopNodeView = connect<{}, {}, {}>(TopNodeToProps, TopNodeDispatch)(TopNode)

const GridToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);

    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id
    }
}
const GridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        setQueryValue,
        callLoad,
        callPage,
        callEdit,
        addState,
        callRemove,
        setPage
    }, dispatch);
    return s;
}
let GridView = connect<{}, {}, {}>(GridToProps, GridDispatch)(Grid)

const EditToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);

    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        kfield: state.kfield,
        field: state.field
    }
}
const EditDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        callRemove,
        cancel,
        returnGrid,
        submitData
    }, dispatch);
    return s;
}
let EditView = connect<{}, {}, {}>(EditToProps, EditDispatch)(Edit)

AddMasterMenu(TopNodeView, store, gb_menu_id);