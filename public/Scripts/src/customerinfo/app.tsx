/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { DatePickText } from '../../comm/com-datepick';

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
    field?: server.ParamCustomerInfo,
    kfield?: server.ParamCustomerInfo
    setInputValue?: Function,
    submitData?: Function,
    cancel?: Function
}

interface GridState {
    tab_index?: number
}
class Grid extends React.Component<GridProps, GridState>{

    constructor() {
        super();
        this.chgFldVal = this.chgFldVal.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.tabs = this.tabs.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.state = { tab_index: 0 };
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

    tabs(i, e) {
        this.setState({ tab_index: i });
    }

    renderTabs(i) {

        let html = null;
        let fd = this.props.field

        if (i == 0)
            html = <EditorText
                value={fd.context1}
                onChange={this.chgFldVal.bind(this, 'context1')} inputClassName="tab-content"/>;
        else if (i == 1)
            html = <EditorText
                value={fd.context2}
                onChange={this.chgFldVal.bind(this, 'context2')} inputClassName="tab-content" />;
        else if (i == 2)
            html = <EditorText
                value={fd.context3}
                onChange={this.chgFldVal.bind(this, 'context3')} inputClassName="tab-content" />;

        return html;
    }

    render() {

        let out_html: JSX.Element = null;
        let { field, menu_name } = this.props;
        let st = this.state;
        //console.log('check firld', pp.field, pp.menu_name);
        out_html = <div>
            <h3 className="title">{menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>
                <nav className="tab">
                    <a href="#tab1" className={'tab-nav' + (st.tab_index == 0 ? ' active' : '')} onClick={this.tabs.bind(this, 0)}>會員加入說明</a>
                    <a href="#tab2" className={'tab-nav' + (st.tab_index == 1 ? ' active' : '')} onClick={this.tabs.bind(this, 1)}>新會員抽獎說明</a>
                    <a href="#tab3" className={'tab-nav' + (st.tab_index == 2 ? ' active' : '')} onClick={this.tabs.bind(this, 2)}>中獎名單</a>
                </nav>
                <section className="tab-main">
                    {this.renderTabs(st.tab_index)}
                </section>

                <footer className="submit-bar clear mt-24 fixed-bottom">
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