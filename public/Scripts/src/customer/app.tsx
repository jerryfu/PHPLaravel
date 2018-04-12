/**
    系統名稱:  會員資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { DatePickText } from '../../comm/com-datepick';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store, setPage } from './pub'
import { getMenuName, pv, ifrmDown, tim } from '../../comm/comm-func';
import pk from '../../comm/param_key';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';

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
        state: string
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.Customer>,
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
    dwExcel(e: React.SyntheticEvent<EventTarget>) {
        e.preventDefault();
        let url_pm = '';
        let pm = {
            tid: tim()
        };
        $.extend(pm, this.props.search);
        url_pm = $.param(pm);

        let src = gb_approot + "Base/ExcelReport/Excel_Customer?" + url_pm;
        ifrmDown(src);
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
            <div className="topBtn-bar btn-group">
                {pv(pk) ? <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{lang.add}</PWButton> : null}
            </div>
            <header className="table-head form-inline">
                <InputText
                    inputClassName="form-element"
                    onChange={this.chgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="請輸入關鍵字"
                />
                <PWButton type="button" className="btn success oi" dataGlyph="print" onClick={this.dwExcel}>
                    {lang.print}
                </PWButton>
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={2} />
                    <col style={{ width: '10%' }} />
                    <col span={2} style={{ width: '12%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '8%' }} />
                </colgroup>
                <thead>
                <tr>
                    {/*<th className="item-edit">{lang.delete}</th>*/}
                    <th className="item-edit">{lang.modify}</th>
                    <th className="text-left">
                        <OrderButton title="Email(登入帳號)"
                            field={'email'}
                            sort={pp.page_grid.sort}
                            now_field={pp.page_grid.field}
                            setSort={this.setSort} />
                    </th>
                    <th className="text-left">
                        <OrderButton title="姓名"
                            field={'c_name'}
                            sort={pp.page_grid.sort}
                            now_field={pp.page_grid.field}
                            setSort={this.setSort} />
                    </th>
                    <th className="text-left">電話</th>
                    <th className="text-left">手機</th>
                    <th className="text-left">
                        <OrderButton title="推薦人姓名"
                            field={'recommand_name'}
                            sort={pp.page_grid.sort}
                            now_field={pp.page_grid.field}
                            setSort={this.setSort} />
                    </th>
                    <th className="text-left">推薦人手機</th>
                    <th>狀態</th>
                </tr>
                </thead>
                <tbody>
                {
                    row_data.map((item, i) => {
                        return <tr key={item.customer_id}>
                            {/*<td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.customer_id)}></PWButton></td>*/}
                            <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.customer_id)}></PWButton></td>
                            <td className="text-left">{item.email}</td>
                            <td className="text-left">{item.c_name}</td>
                            <td className="text-left">{item.tel}</td>
                            <td className="text-left">{item.mobile}</td>
                            <td className="text-left">{item.recommand_name}</td>
                            <td className="text-left">{item.recommand_mobile}</td>
                            <td>
                                <GridState code={item.state} />
                            </td>
                        </tr>
                    })
                }
                {
                    row_empty.map((item, i) => { //不足列數補空列數
                        return <tr key={'empty_row_' + i}><td colSpan={8}>&nbsp;</td></tr>;
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
    field?: server.Customer
    kfield?: server.Customer
    exist?: boolean
    oper_id?: string
    setInputValue?: Function
    cancelState?: Function
    submitData?: Function
    cancel?: Function
    returnGrid?: Function
    menu_name?: string
}
interface StateProps {
    option_prodkind: SelectTextOptions[]
}
class Edit extends React.Component<EditProps, StateProps>{

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
    chgFldVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let struct = {
            [name]: { $set: value }
        };

        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.customer_id;
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
                    <dt className="col-2">姓名</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'c_name')}
                            value={pp.field.c_name}
                            required={true}
                            maxLength={64} />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">Email</dt>
                    <dd className="col-5">
                        <InputText
                            type="email"
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'email')}
                            value={pp.field.email}
                            required={true}
                            maxLength={256} />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">性別</dt>
                    <dd className="col-5">
                        {/*<SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'gender')}
                            options={[{ value: 'M', label: '男' }, { value: 'F', label: '女' },]}
                            is_blank={true}
                            value={pp.field.gender}
                            required={true}
                        />*/}

                        <RadioText
                            id={'sex_M'}
                            inputClassName="radio"
                            value={'M'}
                            checked={pp.field.gender == 'M'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'gender')}
                        />
                        <label htmlFor="sex_M" />男

                        <RadioText
                            id={'sex_F'}
                            inputClassName="radio"
                            value={'F'}
                            checked={pp.field.gender == 'F'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'gender')}
                        />
                        <label htmlFor="sex_F" />女 {' '}
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">手機</dt>
                    <dd className="col-5">
                        <InputText
                            type="tel"
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'mobile')}
                            value={pp.field.mobile}
                            required={true}
                            maxLength={50} />
                    </dd>
                    <dd className="col-5 text-danger">新增會員時預設為會員密碼</dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">地址</dt>
                    <dd className="col-1">
                        <InputText
                            type="text"
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'zip')}
                            value={pp.field.zip}
                            required={true}
                            maxLength={5} />
                    </dd>
                    <dd className="col-8">
                        <InputText
                            type="text"
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'address')}
                            value={pp.field.address}
                            required={true}
                            maxLength={128} />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">推薦人姓名</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'c_name')}
                            value={pp.field.c_name}
                            required={true}
                            maxLength={64} />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">推薦人手機</dt>
                    <dd className="col-5">
                        <InputText
                            type="tel"
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'tel')}
                            value={pp.field.tel}
                            required={false}
                            maxLength={50} />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">狀態</dt>
                    <dd className="col-5">
                        {/*<SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'state')}
                            options={[{ value: 'A', label: '使用' }, { value: 'S', label: '停用' }]}
                            is_blank={true}
                            value={pp.field.state}
                            required={true}
                        />*/}
                        <RadioText
                            id={'state_0'}
                            inputClassName="radio"
                            value={'A'}
                            checked={pp.field.state == 'A'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_0" />使用

                        <RadioText
                            id={'state_1'}
                            inputClassName="radio"
                            value={'S'}
                            checked={pp.field.state == 'S'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_1" />停用
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
        return <span className="label-success">使用</span>;
    else if (code == 'S')
        return <span className="label-muted">停用</span>;
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