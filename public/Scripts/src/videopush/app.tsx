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
import { PWButton, SelectText, AreaText, InputText, InputNum, RadioText, FileUpBtn } from '../../comm/components';
import { setInputValue, callLoad, submitData, store, cancel } from './pub'
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
        return <div><GridView /></div>;
    }
}

//列表介面元件
interface GridProps {
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    callLoad?: Function,
    field?: server.ParamVideoPush,
    kfield?: server.ParamVideoPush
    setInputValue?: Function,
    submitData?: Function,
    cancel?: Function
}
class Grid extends React.Component<GridProps, any>{

    constructor() {
        super();
        this.chgFldVal = this.chgFldVal.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.state = {};
    }
    componentDidMount() {
        this.props.callLoad();
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
        this.props.submitData(this.props.edit_type, this.props.field);
        return;
    }
    cancel(e) {
        this.props.cancel(this.props.kfield);
    }

    render() {

        let out_html: JSX.Element = null;
        let { field, menu_name } = this.props;
        let st = this.state;
        //console.log('check firld', pp.field, pp.menu_name);
        out_html = <div>
            <h3 className="title">{menu_name}
                <small className="oi" data-glyph="tags">編輯</small>
            </h3>
            <div className="alert-warning mb-16">
                影片將會顯示在<br />
                1. 首頁> 精彩花絮區塊<br />
                2. 活動花絮> 列表頁> 頁頭區塊
            </div>
            <form className="form-list" onSubmit={this.submit}>
                <dl className="field">
                    <dt className="col-2">比賽日期</dt>
                    <dd className="col-5">
                        <DatePickText
                            inputViewMode={InputViewMode.edit}
                            onChange={this.chgFldVal.bind(this, 'set_date')}
                            value={field.set_date}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">比賽地點</dt>
                    <dd className="col-5">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'site_name')}
                            value={field.site_name}
                            required={true}
                            maxLength={64}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">主隊</dt>
                    <dd className="col-5">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'home_name')}
                            value={field.home_name}
                            required={false}
                            maxLength={64}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">客隊</dt>
                    <dd className="col-5">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'visiting_name')}
                            value={field.visiting_name}
                            required={false}
                            maxLength={64}
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">影片網址</dt>
                    <dd className="col-9">
                        <InputText
                            onChange={this.chgFldVal.bind(this, 'url')}
                            value={field.url}
                            required={false}
                            maxLength={4000}
                        />
                        <small className="text-danger block">* Youtube：請點選 Youtube 的 [分享]> [嵌入]> 複製 [內嵌程式碼]</small>
                        <small className="text-danger block">* FB：請點選 [滑鼠右鍵] > [顯示影片網址]> 複製 [網址]</small>
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">代表圖(首頁用)</dt>
                    <dd className="col-5">
                        <FileUpBtn id={"index"} fileKey="videopush" title="圖片上傳" is_img={true} />
                    </dd>
                </dl>

                <footer className="submit-bar clear mt-24">
                    <button type="submit" className="btn success oi" data-glyph="circle-check">確認儲存</button>
                    <button type="button" className="btn warning oi" data-glyph="circle-x" onClick={this.cancel}>取消</button>
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
        field: state.field,
        kfield: state.kfield
    }
}
const GridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        submitData,
        callLoad,
        cancel
    }, dispatch);
    return s;
}
let GridView = connect<{}, {}, {}>(GridToProps, GridDispatch)(Grid)

AddMasterMenu(TopNodeView, store, gb_menu_id);