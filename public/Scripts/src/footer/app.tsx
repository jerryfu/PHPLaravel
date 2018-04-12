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
    field?: server.ParamFooter,
    kfield?: server.ParamFooter,
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


    render() {

        let out_html: JSX.Element = null;
        let { field, menu_name } = this.props;
        let st = this.state;
        //console.log('check firld', pp.field, pp.menu_name);
        out_html = <div>
            <h3 className="title">{menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>
                <fieldset className="mt-16">
                    <EditorText
                        value={field.context1}
                        toolbarOptions={[
                            ['h6', 'link', 'clean']
                        ]}
                        formats={['formats/h6', 'h6']}
                        onChange={this.chgFldVal.bind(this, 'context1')} />
                </fieldset>
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