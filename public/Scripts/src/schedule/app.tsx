/**
    系統名稱:Schedule資料維護
    檔案內容:本系統進入點及介面呈現
    建立時間:2017-08-03
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { DatePickText } from '../../comm/com-datepick';
import DateTimePickText from '../../comm/com-datetimepick';
import ModalCom from '../../comm/comm-modal';
//import * as ReactModal from 'react-modal';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn, PageFooter } from '../../comm/components';
import {
    store,
    callRemove, addState, callEdit, setQueryValue, setInputValue, callLoad, callPage, submitData, cancel, returnGrid, setPage, loadRecord, addRecord, setRecordValue, saveRecord,
    addPlayerToSchedule
} from './pub'
import { getMenuName, stdDate, stdTime } from '../../comm/comm-func';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';
import { config, modal_css, pw_rule } from '../../comm/defData';
import TableRecords from './tableRecords';
//import Typeahead from '../../comm/comm-typeahead';

//頂端元件
interface TopNodeProps {
    edit_type?: IEditType,
}
interface TopNodeState {
    PackOption?: PackOption
}
class TopNode extends React.Component<TopNodeProps, TopNodeState>{
    constructor() {
        super();
        this.onCompleteChange = this.onCompleteChange.bind(this);
        this.state = {};
    }

    onCompleteChange(e) {

    }

    render() {
        //let datsour = [{ value: 'AAA', text: '中文' }, { value: 'BBB', text: '測試' }];
        // <Typeahead onCompleteChange={this.onCompleteChange} dataSource={datsour} />
        return <div>
            <GridView />
            <EditView />
        </div>;
    }
}

//列表介面元件
interface GridProps {
    search?: {
        keyword: string,
        state: string,
        schedule_start_date: any,
        schedule_end_date: any,
        workYear: number
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.Schedule>,
    callEdit?: Function,
    callRemove?: Function,
    callPage?: Function,
    callLoad?: Function,
    addState?: Function,
    setQueryValue?: Function,
    setPage?: Function,
    pack_option?: PackOption,
    records?: RecordReturn,
    loadRecord?: Function,
    addRecord?: Function,
    setRecordValue?: Function
    saveRecord?: Function
}
interface GridState {
    isOpenRecords: boolean
    teamOption: RecordTeamOption
    editRecordToogle: string // Home,Visiting
}

class Grid extends React.Component<GridProps, GridState>{

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

    selHome = null;

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

        //let input: HTMLInputElement = e.target as HTMLInputElement;
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
        store.dispatch(setRecordValue(n_state));
        //this.props.setRecordValue(n_state);
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
        this.setState({ editRecordToogle: name })
    }
    frmState(code: string) {
        if (code == 'F')
            return <span className="label-success">比賽完成</span>;
        else if (code == 'C')
            return <span className="label-muted">取消</span>;
        else if (code == 'W')
            return <span className="label-info">預定中</span>;
        else
            return <span className="label">No Use</span>;
    }
    frmArea(code: string) {
        if (code == 'N')
            return <span>北區</span>;
        else if (code == 'S')
            return <span>南區</span>;
        else
            return <span>No Use</span>;
    }

    addPlayerToSchedule(player_id: number, player_name: string, jersey_number: string, team_name: string) {

        let { editRecordToogle } = this.state;
        store.dispatch(addPlayerToSchedule(editRecordToogle, player_id, player_name, jersey_number, team_name));
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
        let sh = pp.search;

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name}</h3>
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{lang.add}</PWButton>
            </div>
            <header className="table-head form-inline">
                <div className="form-inline">
                    <label>年度</label>
                    <SelectText
                        onChange={this.chgQryVal.bind(this, 'workYear')}
                        options={[{ value: 2017, label: '2017' }, { value: 2018, label: '2018' }]}
                        is_blank={true}
                        value={sh.workYear} />

                    <label>日期</label>
                    <DatePickText
                        inputClassName="form-element"
                        inputViewMode={InputViewMode.edit}
                        value={sh.schedule_start_date}
                        required={true}
                        onChange={this.chgQryVal.bind(this, 'schedule_start_date')}
                    />
                    ~
                    <DatePickText
                        inputClassName="form-element"
                        inputViewMode={InputViewMode.edit}
                        value={sh.schedule_end_date}
                        required={true}
                        onChange={this.chgQryVal.bind(this, 'schedule_end_date')}
                    />
                    <InputText
                        inputClassName="form-element"
                        onChange={this.chgQryVal.bind(this, 'keyword')}
                        value={sh.keyword}
                        placeholder="請輸入關鍵字"
                    />

                </div>
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={7} />
                    <col span={2} style={{ width: '12%' }} />
                    <col />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{lang.delete}</th>
                        <th className="item-edit">{lang.modify}</th>
                        <th className="text-left">場次</th>
                        <th className="text-left">
                            <OrderButton title="日期"
                                field={'set_date'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title="場地"
                                field={'Site.site_name'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="區域"
                                field={'PlayDivide.area_sn'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="分組"
                                field={'PlayDivide.divide_name'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title="主隊"
                                field={'home_team_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title="客隊"
                                field={'visiting_team_id'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            <OrderButton title="比賽狀態"
                                field={'state'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.setSort} />
                        </th>
                        <th>
                            設定比賽記錄
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.schedule_id}>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.schedule_id)}></PWButton></td>
                                <td className="item-edit"><PWButton className="hover-success oi" title={lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.schedule_id)}></PWButton></td>
                                <td className="text-left">{item.sno}</td>
                                <td className="text-left">{stdDate(item.set_date) + ' ' + stdTime(item.set_date)}</td>
                                <td className="text-left">{item.site_name}</td>
                                <td>{this.frmArea(item.area_sn)}</td>
                                <td>{item.divide_name}</td>
                                <td className="text-left">{item.home_team}</td>
                                <td className="text-left">{item.visiting_team}</td>
                                <td>{this.frmState(item.state)}</td>
                                <td>
                                    <PWButton className="hover-info oi" title={lang.modify} dataGlyph="flag" onClick={this.clkSet.bind(this, item.schedule_id)}>
                                        設定
                                </PWButton>
                                </td>
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

            <ModalCom
                isOpen={st.isOpenRecords}
                contentLabel="Modal"
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.modalClose}
                className={config.modalMd}
                overlayClassName={config.modalOverlay}>

                <PWButton type="button" onClick={this.modalClose} className={config.modalClose}>
                    {lang.close}
                </PWButton>
                <section className="modal-content animate-top py-32">
                    <header className="px-16 mb-16 clearfix text-left">
                        <div className="btn-group pull-left">
                            {
                                pp.records.home ?
                                    <PWButton
                                        type="button"
                                        className="btn warning oi"
                                        data-glyph="star"
                                        onClick={this.clkRecordToogle.bind(this, 'Home')}>
                                        {'主隊:' + pp.records.home.team_name}
                                    </PWButton> : <span></span>
                            }
                            {
                                pp.records.visiting ?
                                    <PWButton
                                        type="button"
                                        className="btn danger oi"
                                        data-glyph="fire"
                                        onClick={this.clkRecordToogle.bind(this, 'Visiting')}>
                                        {'客隊:' + pp.records.visiting.team_name}
                                    </PWButton> : <span></span>
                            }
                        </div>

                        <div className="form-inline pull-right">
                            <label>比賽狀態設定</label>
                            <SelectText
                                is_blank={true}
                                value={pp.records.field.state}
                                options={
                                    [
                                        { label: '預定中', value: 'W' },
                                        { label: '取消', value: 'C' },
                                        { label: '比賽完成', value: 'F' },
                                    ]
                                }
                                inputViewMode={InputViewMode.edit}
                                onChange={this.chgScheduleVal.bind(this, 'state')}
                            />
                            <PWButton
                                type="button"
                                className="btn success oi ml-16"
                                data-glyph="check"
                                onClick={this.clkSaveRecord}>
                                {lang.save}
                            </PWButton>
                        </div>
                    </header>
                    <main className="px-16">
                        {
                            pp.records.home && pp.records.visiting ?
                                <TableRecords records={st.editRecordToogle == 'Home' ? pp.records.home : pp.records.visiting}
                                    chgFldVal={this.chgRecordVal.bind(this, st.editRecordToogle)}
                                    addPlayerToSchedule={this.addPlayerToSchedule}
                                />
                                : <span>球隊未設定球員</span>
                        }
                    </main>
                </section>
            </ModalCom>
        </div>;
        return out_html;
    }
}

//編輯資料元件
interface EditProps {
    edit_type?: IEditType
    field?: server.Schedule
    kfield?: server.Schedule
    exist?: boolean
    oper_id?: string
    setInputValue?: Function
    cancelState?: Function
    submitData?: Function
    cancel?: Function
    returnGrid?: Function
    menu_name?: string,
    pack_option?: PackOption
}
interface StateProps {
    option_hometeam?: SchTeamOption[],
    option_visitteam?: SchTeamOption[]
}
class Edit extends React.Component<EditProps, StateProps>{

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
        //ft<server.ProdKind[]>(ap.GET__api_Schedule).then((data) => {
        //    let options = data.map((item, i) => {
        //        let r: SelectTextOptions = { value: item.prodkind_id, label: item.kind_name };
        //        return r;
        //    });
        //    this.setState({ option_prodkind: options })
        //})
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.edit_type == IEditType.none && nextProps.edit_type == IEditType.modify) {
            this.setTeamOption(nextProps.field.play_name_id, nextProps.field.home_team_id);
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
    chgPlayNameVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
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
    chgHomeTeamVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let struct = {
            [name]: { $set: value },
            visiting_team_id: { $set: null }
        };

        let visit = this.setVisitTeamOption(this.state.option_hometeam, value);
        this.setState({ option_visitteam: visit });

        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    setTeamOption(play_name_id: any, hometeam_id: any) {
        let home = this.setHomeTeamOption(play_name_id);
        let visit = this.setVisitTeamOption(home, hometeam_id);
        this.setState({ option_hometeam: home, option_visitteam: visit });
    }
    setHomeTeamOption(play_name_id: any) {
        let result: SchTeamOption[] = [];
        let playname_list = this.props.pack_option.option_team.filter(x => x.play_name_id == play_name_id);

        if (playname_list.length > 0) {
            let home = playname_list[0].team;
            result = home;
        }
        return result;
    }
    setVisitTeamOption(home: SchTeamOption[], hometeam_id?: any) {
        let result: SchTeamOption[] = [];
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
    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.schedule_id;
        this.props.submitData(id, this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
        this.props.returnGrid();
    }
    frmArea(code: string) {
        if (code == 'N')
            return "北區";
        else if (code == 'S')
            return "南區";
        else
            return "";
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;
        let show = pp.edit_type == IEditType.insert || pp.edit_type == IEditType.modify ? 'block' : 'none';

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <div className="alert-warning mb-16">
                <strong>年度:</strong> 請至 [系統設定]> [參數管理] 設定當年度<br />
                <strong>比賽記錄:</strong> 比賽記錄設定完畢後無法修改"年度"、"主隊"、"客隊"
            </div>
            <form className="form-list" onSubmit={this.submit}>
                <dl className="field">
                    <dt className="col-2">場次</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'sno')}
                            value={pp.field.sno}
                            required={true}
                            maxLength={20}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">
                        日期
                    </dt>
                    <dd className="col-5">
                        <DateTimePickText value={pp.field.set_date} onChange={this.chgFldVal.bind(this, 'set_date')} />
                        <small className="text-danger">格式: 2017-08-01 17:00</small>
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">年度</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgPlayNameVal.bind(this, 'play_name_id')}
                            options={pp.pack_option.option_play_name.optMake(x => x.playname_id, y => y.play_name)}
                            is_blank={true}
                            value={pp.field.play_name_id}
                            required={true}
                            disabled={pp.field.hasRecords}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">場地</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'site_id')}
                            options={pp.pack_option.option_site.optMake(x => x.site_id, x => x.site_name)}
                            is_blank={true}
                            value={pp.field.site_id}
                            required={true}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">主隊</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgHomeTeamVal.bind(this, 'home_team_id')}
                            options={this.state.option_hometeam.optMake(x => x.team_id, x => `${this.frmArea(x.area_sn)}${x.divide_name}-${x.team_name}`)}
                            is_blank={true}
                            value={pp.field.home_team_id}
                            required={true}
                            disabled={pp.field.hasRecords}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">客隊</dt>
                    <dd className="col-5">
                        <SelectText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'visiting_team_id')}
                            options={this.state.option_visitteam.optMake(x => x.team_id, x => `${this.frmArea(x.area_sn)}${x.divide_name}-${x.team_name}`)}
                            is_blank={true}
                            value={pp.field.visiting_team_id}
                            required={true}
                            disabled={pp.field.hasRecords}
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
        oper_id: state.oper_id,
        pack_option: state.pack_option,
        records: state.records
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
        loadRecord,
        addRecord,
        setRecordValue,
        saveRecord
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
        field: state.field,
        pack_option: state.pack_option
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