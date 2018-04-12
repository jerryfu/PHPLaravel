/**
    系統名稱:PlayName資料維護
    檔案內容:本系統進入點及介面呈現
    建立時間:2017-08-02
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store, setPage } from './pub'
import { getMenuName } from '../../comm/comm-func';
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
    page_grid?: GridInfo<server.PlayName>,
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
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{lang.add}</PWButton>
            </div>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={2} />
                    <col style={{ width: '16%' }} />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th>
                            <OrderButton title="年度"
                                field={'yy'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title="賽名"
                                field={'play_name'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} /></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.playname_id}>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.playname_id)}></PWButton></td>
                                <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.playname_id)}></PWButton></td>
                                <td>{item.yy}</td>
                                <td className="text-left">{item.play_name}</td>
                            </tr>
                        })
                    }
                    {
                        row_empty.map((item, i) => { //不足列數補空列數
                            return <tr key={'empty_row_' + i}><td colSpan={4}>&nbsp;</td></tr>;
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
    field?: server.PlayName
    kfield?: server.PlayName
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
        //ft<server.ProdKind[]>(ap.GET__api_PlayName).then((data) => {
        //    let options = data.map((item, i) => {
        //        let r: SelectTextOptions = { value: item.prodkind_id, label: item.kind_name };
        //        return r;
        //    });
        //    this.setState({ option_prodkind: options })
        //})
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
        let id = this.props.field.playname_id;
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
                    <dt className="col-2">年度</dt>
                    <dd className="col-5">
                        <InputNum
                            id={'yy'}
                            ref={'yy'}
                            onChange={this.chgFldVal.bind(this, 'yy')}
                            value={pp.field.yy}
                            required={true}
                            onlyPositive={true}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">賽名</dt>
                    <dd className="col-5">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'play_name')}
                            value={pp.field.play_name}
                            required={false}
                            maxLength={60}
                        />
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