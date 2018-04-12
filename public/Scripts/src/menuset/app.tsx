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
import { PWButton, SelectText, AreaText, InputText, InputNum, RadioText, FileUpBtn, CheckText, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store, setPage } from './pub'
import { getMenuName, stdDate, tim } from '../../comm/comm-func';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';


let option_parent: server.Menu[] = [{ menu_id: 0, menu_name: '無' }];
let option_role: server.LogRole[] = [];

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
        is_folder: any,
        parent_id: number
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.Menu>,
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
                    onChange={this.chgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="請輸入Menu名稱"
                />
                <label>狀態</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'is_folder')}
                    options={[{ value: 'true', label: '父選單' }, { value: 'false', label: '子選單' }]}
                    is_blank={true}
                    blank_text="全部"
                    value={pp.search.is_folder}
                />

                <label>父選單</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'parent_id')}
                    options={option_parent.optMake(x => x.menu_id, x => x.menu_name)}
                    is_blank={true}
                    blank_text="全部"
                    value={pp.search.parent_id}
                />

            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={4} />
                    <col style={{ width: '16%' }} />
                    <col span={2} style={{ width: '14%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th className="text-left">
                            <OrderButton title="編號"
                                field={'menu_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="對應父選單"
                                field={'parent_menu_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="選單名稱"
                                field={'menu_name'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="area"
                                field={'area'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="controller"
                                field={'controller'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="action"
                                field={'action'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            icon_class
                    </th>
                        <th>
                            <OrderButton title="排序"
                                field={'sort'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="選單狀態"
                                field={'is_folder'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.menu_id}>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.menu_id)}></PWButton></td>
                                <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.menu_id)}></PWButton></td>
                                <td className="text-left">{item.menu_id}</td>
                                <td className="text-left">{item.parent_menu_id}</td>
                                <td className="text-left">{item.menu_name}</td>
                                <td className="text-left">{item.area}</td>
                                <td className="text-left">{item.controller}</td>
                                <td className="text-left">{item.action}</td>
                                <td className="text-left">{item.icon_class}</td>
                                <td>{item.sort}</td>
                                <td>{<GridFloderState code={item.is_folder} />}</td>
                            </tr>
                        })
                    }
                    {
                        row_empty.map((item, i) => { //不足列數補空列數
                            return <tr key={'empty_row_' + i}><td colSpan={11}>&nbsp;</td></tr>;
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
    field?: server.Menu
    kfield?: server.Menu
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
    //option_roles: server.LogRole[],
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
            //contentState: EditorState.createEmpty() //EditorState.createEmpty()
        };
    }
    componentDidMount() {
        //CKEDITOR.replace('news_content', { customConfig: '../ckeditor/config.js?v2=' + tim() });
        //ft<server.ProdKind[]>(ap.GET__api_News).then((data) => {
        //    let options = data.map((item, i) => {
        //        let r: SelectTextOptions = { value: item.prodkind_id, label: item.kind_name };
        //        return r;
        //    });
        //    this.setState({ option_prodkind: options })
        //})
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.edit_type == IEditType.none && (nextProps.edit_type == IEditType.insert || nextProps.edit_type == IEditType.modify)) {
            //CKEDITOR.instances['news_content'].setData(nextProps.field.news_content);
            if (nextProps.edit_type == IEditType.insert) {

                let struct = {
                    role_array: { $set: option_role }
                };
                let n_state = update(nextProps.field, struct);
                this.props.setInputValue(n_state);
            }
        }
    }
    chgFldVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let struct = {
            [name]: { $set: value }
        };

        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    chgRoleVal(i, name, value: any, e: React.SyntheticEvent<EventTarget>) {

        let input: HTMLInputElement = e.target as HTMLInputElement;
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
        //console.log('check', contentState.getCurrentContent());
        this.setState({
            //contentState,
        });
    }

    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.menu_id;
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
                    <dt className="col-2">編號</dt>
                    <dd className="col-5">
                        <InputNum
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'menu_id')}
                            value={pp.field.menu_id}
                            required={true}
                            disabled={pp.edit_type == IEditType.modify}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">父選單</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'parent_menu_id')}
                            options={option_parent.optMake(x => x.menu_id, x => x.menu_name)}
                            is_blank={false}
                            value={pp.field.parent_menu_id}
                            required={true}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">選單名稱</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'menu_name')}
                            value={pp.field.menu_name}
                            required={true}
                            maxLength={64}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">area</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'area')}
                            value={pp.field.area}
                            required={false}
                            maxLength={64}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">controller</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'controller')}
                            value={pp.field.controller}
                            required={false}
                            maxLength={16}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">action</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'action')}
                            value={pp.field.action}
                            required={false}
                            maxLength={16}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">icon_class</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'icon_class')}
                            value={pp.field.icon_class}
                            required={false}
                            maxLength={16}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">排序</dt>
                    <dd className="col-5">
                        <InputNum
                            inputClassName="form-element inline"
                            onChange={this.chgFldVal.bind(this, 'sort')}
                            value={pp.field.sort}
                            required={true}
                        />
                        <small>數字愈大愈前面</small>
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">選單狀態</dt>
                    <dd className="col-4">
                        <RadioText
                            inputClassName="radio"
                            id={'is_folder_0'}
                            value={1}
                            checked={pp.field.is_folder == true}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'is_folder')}
                        />
                        <label htmlFor="is_folder_0" />父選單

                                <RadioText
                            inputClassName="radio"
                            id={'is_folder_1'}
                            value={0}
                            checked={pp.field.is_folder == false}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'is_folder')}
                        />
                        <label htmlFor="is_folder_1" />子選單
                            </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">使用狀態</dt>
                    <dd className="col-4">
                        <RadioText
                            inputClassName="radio"
                            id={'is_use_0'}
                            value={1}
                            checked={pp.field.is_use == true}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'is_use')}
                        />
                        <label htmlFor="is_use_0" />使用中

                                <RadioText
                            inputClassName="radio"
                            id={'is_use_1'}
                            value={0}
                            checked={pp.field.is_use == false}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'is_use')}
                        />
                        <label htmlFor="is_use_1" />未使用
                            </dd>
                </dl>


                <fieldset className="mt-16">
                    <legend className="underline">[ 可檢視角色 ]</legend>

                    {
                        pp.field.role_array.map((role, i) => {
                            return <div key={role.role_id}>
                                <CheckText
                                    id={'role_' + role.role_id}
                                    value={role.role_use}
                                    checked={role.role_use == true}
                                    inputViewMode={InputViewMode.edit}
                                    onClick={this.chgRoleVal.bind(this, i, 'role_use')}
                                />
                                {role.role_name}
                            </div>;
                        })
                    }
                </fieldset>


                <footer className="submit-bar fixed-bottom mt-24">
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
const GridFloderState = ({ code }: { code: boolean }) => {
    if (code == true)
        return <span className="label-success">父選單</span>;
    else if (code == false)
        return <span className="label-info">子選單</span>;
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

async function Start() {
    let data1 = await ft<ReturnData<server.Menu[]>>(ap.GET__api_Menu_Option, {});
    let data2 = await ft<ReturnData<server.LogRole[]>>(ap.GET__api_LogRole_Option, {});
    data1.data.map(x => {
        option_parent.push(x);
    });
    option_role = data2.data;
    AddMasterMenu(TopNodeView, store, gb_menu_id);
}

Start(); //程式啟動點