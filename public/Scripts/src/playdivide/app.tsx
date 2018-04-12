/**
    系統名稱:PlayDivide,PlayName資料維護
    檔案內容:本系統進入點及介面呈現
    建立時間:2017-08-10
*/
import React = require('react');
import { findDOMNode } from 'react-dom';
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragSource, DropTarget, DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import { callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, store, setPage, editTeam, setSelectTeam, submitTeam, sortTeam, sortRedo } from './pub'
import { getMenuName, tosMessage } from '../../comm/comm-func';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';

let ItemTypes = {
    GoalSort: 'A',
    AreaMove: 'B'
}
const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

const poolAreaSource = {
    beginDrag(props) {
        //console.log('beginDrag', props)
        return {
            id: props.item.team_id,
            index: props.index
        };
    },
};
const fromPoolAreaTarget = {
    hover(props, monitor, component) {
        //console.log('hover 主...', monitor.isOver(), props);

        if (monitor.isOver()) {

            let obj = monitor.getItem();
            if (obj.kind == 'A') {
                //obj.kind = 'B';
                //obj.index = props.teams.length;
                //props.add(obj.i, null);
            } else {

            }
        }
    },
    drop(props, monitor, component) {
        var i = monitor.getItem().index;
        //console.log('drop 主...', props, i);
        props.add(i, null);
    }
};

const goalAreaSource = {
    beginDrag(props) {

        mlog('goalAreaSource', 'beginDrag', 'run')

        return {
            id: props.id, //被拖的物件在拖的過程這個值是會變的
            index: props.index
        };
    },
};
const goalAreaTarget = {
    hover(props, monitor, component) {

        const dragIndex = monitor.getItem().index; //
        const hoverIndex = props.index; //被hover 的元件Index值

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
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
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
        mlog('drop 左...')
        props.sortRedo();
        //const item = monitor.getItem();
        //const delta = monitor.getDifferenceFromInitialOffset();
        //const left = Math.round(item.left + delta.x);
        //const top = Math.round(item.top + delta.y);

        //component.moveBox(item.id, left, top);
    }
};


class Container extends React.Component<any, any> {

    render() {

        let pp = this.props;
        //const { connectDropTarget } = this.props;
        return <fieldset className="col-6">
            <legend className="bg-dark text-white p-8">
                已加入隊伍
            </legend>
            {
                pp.teams.map((item, i) => {
                    return <TeamItem
                        item={item}
                        key={item.team_id}
                        moveCard={this.props.sortTeam}
                        sortRedo={this.props.sortRedo}
                        id={item.team_id}
                        index={i}
                        remove={pp.remove.bind(this, i)}
                    />
                })
            }
        </fieldset>;
    }
}
@DropTarget([ItemTypes.GoalSort, ItemTypes.AreaMove], goalAreaTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.GoalSort, goalAreaSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
class TeamItem extends React.Component<any, any> {
    render() {
        const { isDragging, connectDragSource, connectDropTarget, remove } = this.props;
        let item = this.props.item;
        let i = this.props.index;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <dl className="cells mb-8" id={'myId' + item.team_id} key={item.team_id} style={{ ...style, opacity }}>
                <dt className="cell w-75 bg-light px-8">{item.team_name}</dt>
                <dd className="cell w-25">
                    <button className="btn danger w-100 oi" data-glyph="arrow-right" onClick={remove}>
                        移除
                    </button>
                </dd>
            </dl>
        ));
    }
}

@DragSource(ItemTypes.AreaMove, poolAreaSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
class TeamSource extends React.Component<any, any> {
    render() {
        const { isDragging, connectDragSource, add } = this.props;
        let item = this.props.item;
        let i = this.props.index;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(
            <dl className="cells mb-8" key={item.team_id} style={{ ...style, opacity }}>
                <dt className="cell w-75 bg-light px-8">{item.team_name}</dt>
                <dd className="cell w-25">
                    <button type="button" className="btn success w-100 oi" data-glyph="arrow-left" onClick={add.bind(this, i)}>
                        加入
                    </button>
                </dd>
            </dl>
        );
    }
}

// 全域
let option_playname: server.PlayName[] = [];
let option_yy: number[] = [];
let option_area: SelectTextOptions[] = [];
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
        let pp = this.props;
        console.log('check type', pp.edit_type);

        if (pp.edit_type == IEditType.none)
            return <GridView />;

        if (pp.edit_type == IEditType.modify || pp.edit_type == IEditType.insert)
            return <EditView />;

        if (pp.edit_type == IEditType.view)
            return <SetTeamView />;
    }
}


const textArea = (code: string) => {
    if (code == 'N')
        return '北區';
    else if (code == 'S')
        return '南區';
    else
        return null;
}

//列表介面元件
interface GridProps {
    search?: {
        keyword: string,
        yy: string,
        area: string
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.PlayDivide>,
    callEdit?: Function,
    callRemove?: Function,
    callPage?: Function,
    callLoad?: Function,
    addState?: Function,
    setQueryValue?: Function,
    setPage?: Function,
    editTeam?: Function
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
    cleSetTeam(play_divide_id, e) {
        this.props.editTeam(play_divide_id);
    }

    frmArea(code: string) {
        return <label>{textArea(code)}</label>;
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
                <strong>刪除:</strong> 請先移除隊伍後才可刪除
            </div>
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{lang.add}</PWButton>
            </div>
            <header className="table-head form-inline">
                <label>年度</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'yy')}
                    options={option_yy.optMake(x => x, y => y)}
                    is_blank={true}
                    value={pp.search.yy} />

                <label>區別</label>
                <SelectText
                    onChange={this.chgQryVal.bind(this, 'area')}
                    options={option_area}
                    is_blank={true}
                    blank_text="全部"
                    value={pp.search.area} />

                <label>分組</label>
                <InputText
                    inputClassName="form-element"
                    onChange={this.chgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="分組名稱"
                />
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={3} />
                    <col style={{ width: '18%' }} />
                    <col span={3} style={{ width: '14%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th className="text-left">
                            年度名稱
                    </th>
                        <th>
                            <OrderButton title="區別"
                                field={'area_sn'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="分組名稱"
                                field={'divide_name'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>隊伍數量</th>
                        <th>設定隊伍</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.play_divide_id}>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.play_divide_id)}></PWButton></td>
                                <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.play_divide_id)}></PWButton></td>
                                <td className="text-left">
                                    {item.play_name}</td>
                                <td>
                                    {this.frmArea(item.area_sn)}
                                </td>
                                <td>{item.divide_name}</td>
                                <td>{item.team_count}</td>
                                <td>
                                    <PWButton
                                        className="hover-info oi"
                                        title={'設定'}
                                        dataGlyph="transfer"
                                        onClick={this.cleSetTeam.bind(this, item.play_divide_id)}>
                                    </PWButton>
                                </td>
                            </tr>
                        })
                    }
                    {
                        row_empty.map((item, i) => { //不足列數補空列數
                            return <tr key={'empty_row_' + i}><td colSpan={7}>&nbsp;</td></tr>;
                        })
                    }
                </tbody>
            </table>
            <PageFooter search={pp.search} page_grid={pp.page_grid} callPage={this.props.callPage} />
        </div>;

        return out_html;
    }
}

interface VV { //ref Api PlayDivideTeamController Get Select
    play_divide_id: number
    divide_name: string
    play_name: string
    area_sn: string
    teamDivSet: Array<server.PlayDivideTeam>
    teamNotSet: Array<server.Team>
}
interface SetTeamProps {
    returnGrid?: React.EventHandler<any>;
    set_play_team?: VV;
    setSelectTeam?: Function
    submitTeam?: Function
    editTeam?: Function
    sortTeam?: Function
    sortRedo?: Function
}
interface SetTeamState {

}
@DragDropContext(HTML5Backend) //分組隊伍設定判面
class SetTeam extends React.Component<SetTeamProps, SetTeamState>{
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

        let additem: server.PlayDivideTeam = {
            play_divide_team_id: 0,
            play_divide_id: obj.play_divide_id,
            team_id: get_item.team_id,
            team_name: get_item.team_name,
            sort: 0
        }

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

        let additem: server.PlayDivideTeam = {
            play_divide_team_id: 0,
            play_divide_id: obj.play_divide_id,
            team_id: get_item.team_id,
            team_name: get_item.team_name,
            sort: 0
        }

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

        let removeitem: server.Team = {
            team_id: get_item.team_id,
            team_name: get_item.team_name
        }

        let struct = {
            teamNotSet: { $push: [removeitem] },
            teamDivSet: { $splice: [[i, 1]] }
        };

        let n_state = update(this.props.set_play_team, struct);
        this.props.setSelectTeam(n_state);
    }
    async submit(e) {
        let pp = this.props;
        let data = await ft<ReturnBase>(ap.POST__api_PlayDivideTeam, pp.set_play_team);
        if (data.state == 0) {
            tosMessage('', lang.fi_update, ToastrType.success);
            //pp.editTeam(pp.set_play_team.play_divide_id);
        }
    }
    sortItem(dragIndex, hoverIndex) {
        //console.log('sortItem', dragIndex, hoverIndex);
        const set_teams = this.props.set_play_team.teamDivSet;
        const dragCard = set_teams[dragIndex];

        let n_state = update(this.props.set_play_team, {
            teamDivSet: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }

        })
        this.props.sortTeam(n_state);
    }
    sortRedo() {

        //執行完成後 對 sort欄位做更新

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
        //console.log('Hello!', this.props.set_play_team);
        let pp = this.props;
        let st = this.state;

        return <div>
            <h3 className="title">{} <small className="oi" data-glyph="tags">設定隊伍</small></h3>
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="check" onClick={this.submit}>{lang.save}</PWButton>
                {}
                <PWButton className="btn warning oi" dataGlyph="chevron-left" onClick={pp.returnGrid}>
                    {lang.return_list}
                </PWButton>
            </div>
            <h4>{pp.set_play_team.play_name}.{textArea(pp.set_play_team.area_sn)}.{pp.set_play_team.divide_name}</h4>
            <div className="row row-x0">
                <Container
                    teams={pp.set_play_team.teamDivSet}
                    sortTeam={this.sortItem}
                    sortRedo={this.sortRedo}
                    remove={this.remove}
                    add={this.add}
                />
                <fieldset className="col-6">
                    <legend className="bg-dark text-white p-8">
                        未加入隊伍
                    </legend>
                    {
                        pp.set_play_team.teamNotSet.map((item, i) => {
                            return (
                                <TeamSource
                                    key={item.team_id}
                                    add={this.add.bind(this, i)}
                                    item={item}
                                    sortTeam={this.sortItem}
                                    sortRedo={this.sortRedo}
                                    index={i}
                                />
                            );
                        })
                    }
                </fieldset>
            </div>
        </div>;
    }
}

//編輯資料元件
interface EditProps {
    edit_type?: IEditType
    field?: server.PlayDivide
    kfield?: server.PlayDivide
    exist?: boolean
    oper_id?: string
    setInputValue?: Function
    cancelState?: Function
    submitData?: Function
    cancel?: Function
    returnGrid?: Function
    menu_name?: string,
}
interface EditState {
    option_prodkind: SelectTextOptions[]
}
class Edit extends React.Component<EditProps, EditState>{

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
        //ft<server.ProdKind[]>(ap.GET__api_PlayDivide,PlayName).then((data) => {
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
        let id = this.props.field.play_divide_id;
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
            <div className="alert-warning mb-16">
                <strong>年度名稱:</strong> 請至 [系統設定]> [參數管理] 設定當年度
            </div>
            <form className="form-list" onSubmit={this.submit}>
                <dl className="field">
                    <dt className="col-2">年度名稱</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'play_name_id')}
                            options={option_playname.optMake(x => x.playname_id, x => x.play_name)}
                            is_blank={true}
                            value={pp.field.play_name_id}
                            required={true}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">區別</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'area_sn')}
                            options={option_area}
                            is_blank={true}
                            value={pp.field.area_sn}
                            required={true}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">組別名稱</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'divide_name')}
                            value={pp.field.divide_name}
                            required={true}
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
let TopNodeView = connect<{}, {}, TopNodeProps>(TopNodeToProps, TopNodeDispatch)(TopNode)

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
        setPage,
        editTeam
    }, dispatch);
    return s;
}
let GridView = connect<{}, {}, GridProps>(GridToProps, GridDispatch)(Grid)

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
let EditView = connect<{}, {}, EditProps>(EditToProps, EditDispatch)(Edit)

const SetTeamToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        set_play_team: state.set_play_team
    }
}
const SetTeamDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        returnGrid,
        setSelectTeam,
        submitTeam,
        editTeam,
        sortTeam,
        sortRedo
    }, dispatch);
    return s;
}
let SetTeamView = connect<{}, {}, SetTeamProps>(SetTeamToProps, SetTeamDispatch)(SetTeam)

async function Start() {
    let data1 = await ft<ReturnData<server.PlayName[]>>(ap.GET__api_PlayName_Option, {});
    let data2 = await ft<number[]>(ap.GET__api_Utility_GetYY, {})
    option_playname = data1.data;
    option_yy = data2;
    option_area = [{ label: "北區", value: "N" }, { label: "南區", value: "S" }];
    AddMasterMenu(TopNodeView, store, gb_menu_id);
}

Start(); //程式啟動點