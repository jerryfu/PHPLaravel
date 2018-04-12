/**
    系統名稱:  球員資料維護
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
//import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch as ReduxDispatch } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store } from './pub'
import { getMenuName, stdNumber, tim, ifrmDown } from '../../comm/comm-func';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';
import { DatePickText } from '../../comm/com-datepick';
import { ReactAutoSelectText } from '../../comm/comm-superselect';

//頂端元件
interface TopNodeProps {
}
type TopNodeMerge = ITopNodeToProps & ITopNodeDispatch & TopNodeProps
class TopNode extends React.Component<TopNodeMerge, any>{
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return <div>
            <GridView />
            <EditView />
        </div>;
    }
}

//列表介面元件
interface GridProps {
}
type GridMerge = IGridToProps & IGridDispatch & GridProps
class Grid extends React.Component<GridMerge, any>{

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

        let { oper_id } = this.props
        if (prevProps.oper_id != oper_id) {
            this.reloadQuery(null);
        }
    }
    keep_search;
    keep_field;
    keep_sort;

    chgQryVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        this.props.setQueryValue(name, value);
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

    frmState(code: string) {
        if (code == 'A')
            return <span className="label-success">啟用</span>;
        else if (code == 'C')
            return <span className="label-muted">停止</span>;
        else
            return <span className="label">No Use</span>;
    }
    dwExcel(e: React.SyntheticEvent<EventTarget>) {
        e.preventDefault();
        let url_pm = '';
        let pm = {
            tid: tim()
        };
        $.extend(pm, this.props.search);
        url_pm = $.param(pm);

        let src = gb_approot + "Base/ExcelReport/Excel_Player?" + url_pm;
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
            <div className="alert-warning mb-16">
                <strong>前台排序:</strong> 依名稱排序
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
                <label>球隊</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'team_id')}
                    options={pp.option_team.optMake(x => x.team_id, x => x.team_name)}
                    is_blank={true}
                    value={pp.search.team_id} />
                <PWButton type="button" className="btn success oi" dataGlyph="print" onClick={this.dwExcel}>
                    {lang.print}
                </PWButton>
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={2} />
                    <col style={{ width: '24%' }} />
                    <col />
                    <col style={{ width: '12%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th className="text-left">
                            <OrderButton title="身分證字號"
                                field={'idno'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title="姓名"
                                field={'team_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />

                        </th>
                        <th className="text-left">
                            <OrderButton title="球隊"
                                field={'team_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>狀態</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.player_id}>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.player_id)}></PWButton></td>
                                <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.player_id)}></PWButton></td>
                                <td className="text-left">{item.idno}</td>
                                <td className="text-left">{item.player_name}</td>
                                <td className="text-left">{item.team_name}</td>
                                <td>{this.frmState(item.state)}</td>
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
}
interface EditState {

}
type EditMerge = IEditToProps & IEditDispatch & EditProps
class Edit extends React.Component<EditMerge, EditState>{

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
        //ft<server.ProdKind[]>(ap.GET__api_Player).then((data) => {
        //    let options = data.map((item, i) => {
        //        let r: SelectTextOptions = { value: item.prodkind_id, label: item.kind_name };
        //        return r;
        //    });
        //    this.setState({ option_prodkind: options })
        //})
    }
    chgFldVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        //let input: HTMLInputElement = e.target as HTMLInputElement;
        this.props.setInputValue(name, value);
    }
    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.player_id;
        if (!this.props.field.team_id) {
            alert("請選擇所屬球隊!");
            return
        }

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
        var Toptions = pp.option_team.map(x => { return { id: x.team_id, name: x.team_name }; });

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>
                <dl className="field">
                    <dt className="col-2">球隊</dt>
                    <dd className="col-5">
                        <ReactAutoSelectText
                            onChange={this.chgFldVal.bind(this, 'team_id')}
                            options={Toptions}
                            value={pp.field.team_id}
                        />
                        {/*<SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'team_id')}
                            options={pp.option_team.optMake(x => x.team_id, x => x.team_name)}
                            is_blank={true}
                            value={pp.field.team_id}
                            required={true}
                        />*/}
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">姓名</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'player_name')}
                            value={pp.field.player_name}
                            required={true}
                            maxLength={60}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">背號</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'jersey_number')}
                            value={pp.field.jersey_number}
                            required={false}
                            maxLength={60}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">身分證字號</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'idno')}
                            value={pp.field.idno}
                            required={true}
                            maxLength={11}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">狀態</dt>
                    <dd className="col-5">
                        <RadioText
                            inputClassName='radio'
                            id={'state_0'}
                            value={'A'}
                            checked={pp.field.state == 'A'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_0" />啟用

                        <RadioText
                            inputClassName='radio'
                            id={'state_1'}
                            value={'C'}
                            checked={pp.field.state == 'C'}
                            inputViewMode={InputViewMode.edit}
                            onClick={this.chgFldVal.bind(this, 'state')}
                        />
                        <label htmlFor="state_1" />停止
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">地址</dt>
                    <dd className="col-10">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'address')}
                            value={pp.field.address}
                            required={false}
                            maxLength={200}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">電話</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'tel')}
                            value={pp.field.tel}
                            required={false}
                            maxLength={20}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">身高</dt>
                    <dd className="col-5">
                        <div className="input-group">
                            <InputNum
                                onChange={this.chgFldVal.bind(this, 'height')}
                                value={pp.field.height}
                                required={false}
                                onlyPositive={true}
                            />
                            <span className="input-group-addon">公分</span>
                        </div>
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">體重</dt>
                    <dd className="col-5">
                        <div className="input-group">
                            <InputNum
                                onChange={this.chgFldVal.bind(this, 'weight')}
                                value={pp.field.weight}
                                required={false}
                                onlyPositive={true}
                            />
                            <span className="input-group-addon">公斤</span>
                        </div>
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">生日</dt>
                    <dd className="col-5">
                        <DatePickText
                            inputClassName="w-100"
                            inputViewMode={InputViewMode.edit}
                            value={pp.field.birthday}
                            required={false}
                            onChange={this.chgFldVal.bind(this, 'birthday')}
                        />
                    </dd>
                </dl>

                <dl className="field">
                    <dt className="col-2">位置</dt>
                    <dd className="col-5">
                        <SelectText
                            onChange={this.chgFldVal.bind(this, 'positions')}
                            options={[
                                { label: 'PF(大前鋒)', value: 'PF' },
                                { label: 'SF(小前鋒)', value: 'SF' },
                                { label: 'C(中鋒)', value: 'C' },
                                { label: 'SG(得分後衛)', value: 'SG' },
                                { label: 'PG(控球後衛)', value: 'PG' }
                            ]}
                            is_blank={true}
                            required={false}
                            value={pp.field.positions} />
                    </dd>
                </dl>


                <dl className="field">
                    <dt className="col-2">球員照片</dt>
                    <dd className="col-5">
                        {pp.edit_type == IEditType.modify ?
                            [<FileUpBtn id={pp.field.player_id} fileKey="player" title="人像圖上傳" is_img={true} />,
                            <small className="text-danger">背景請去背以達到最佳瀏覽效果 (背景透明 或 底色設為 #F6F6F6)</small>]
                            : <span className="text-danger">{lang.after_insert}</span>
                        }
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

/*=========================Redux連接元件及Action=========================*/
interface ITopNodeToProps {
    edit_type: IEditType
}
interface ITopNodeDispatch {

}
const TopNodeToProps = (state, ownProps): ITopNodeToProps => {
    return {
        edit_type: state.edit_type
    }
}
const TopNodeDispatch = (dispatch, ownProps): ITopNodeDispatch => {
    let s = bindActionCreators({}, dispatch);
    return s;
}
let TopNodeView = connect<ITopNodeToProps, ITopNodeDispatch, TopNodeProps>(TopNodeToProps, TopNodeDispatch)(TopNode)


interface IGridToProps {
    menu_name?: string,
    edit_type?: IEditType,
    page_grid?: GridInfo<server.Player>,
    search?: {
        keyword?: string,
        team_id?: number
    },
    oper_id?: string,
    option_team?: server.Team[]
}
interface IGridDispatch {
    callEdit?: Function,
    callRemove?: Function,
    callPage?: Function,
    callLoad?: Function,
    addState?: Function,
    setQueryValue?: Function
}
const GridToProps = (state, ownProps): IGridToProps => {
    let menu = getMenuName(state.menudata);

    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id,
        option_team: state.option_team
    }
}
const GridDispatch = (dispatch, ownProps): IGridDispatch => {
    let s = bindActionCreators({
        setInputValue,
        setQueryValue,
        callLoad,
        callPage,
        callEdit,
        addState,
        callRemove
    }, dispatch);
    return s;
}
let GridView = connect<IGridToProps, IGridDispatch, GridProps>(GridToProps, GridDispatch)(Grid)


interface IEditToProps {
    edit_type?: IEditType,
    field?: server.Player,
    kfield?: server.Player,
    exist?: boolean,
    oper_id?: string,
    menu_name?: string,
    option_team?: server.Team[]
}
interface IEditDispatch {
    setInputValue?: Function
    cancelState?: Function
    submitData?: Function
    cancel?: Function
    returnGrid?: Function
}
const EditToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);

    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        kfield: state.kfield,
        field: state.field,
        option_team: state.option_team
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
let EditView = connect<IEditToProps, IEditDispatch, EditProps>(EditToProps, EditDispatch)(Edit)

AddMasterMenu(TopNodeView, store, gb_menu_id);