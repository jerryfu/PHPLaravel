/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn } from '../../comm/components';
import { setInputValue, submitData, store, chgPW } from './pub'
import { getMenuName, pv } from '../../comm/comm-func';
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
        return <EditView />;
    }
}

//編輯資料元件
interface EditProps {
    field?: chgPW
    kfield?: chgPW
    exist?: boolean
    oper_id?: string
    setInputValue?: Function
    submitData?: Function
    menu_name?: string,
}

class Edit extends React.Component<EditProps, any>{

    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.state = {
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

        this.props.submitData(this.props.field);
        return;
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;

        out_html = <div>
            <h3 className="title">{this.props.menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>
                <dl className="field">
                    <dt className="col-2">目前密碼</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'OldPassword')}
                            value={pp.field.OldPassword}
                            required={true}
                            maxLength={16}
                            type="password"
                        />
                    </dd>
                </dl>
                <dl className="field">
                    <dt className="col-2">新密碼</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'NewPassword')}
                            value={pp.field.NewPassword}
                            required={true}
                            maxLength={16}
                            type="password"
                        />
                    </dd>
                    {/*<dd className="col-5 text-danger">密碼規則</dd>*/}
                </dl>
                <dl className="field">
                    <dt className="col-2">確認密碼</dt>
                    <dd className="col-5">
                        <InputText
                            inputClassName="form-element"
                            onChange={this.chgFldVal.bind(this, 'ConfirmPassword')}
                            value={pp.field.ConfirmPassword}
                            required={true}
                            maxLength={16}
                            type="password"
                        />
                    </dd>
                </dl>
                <footer className="submit-bar clear mt-24">
                    <PWButton type="submit" className="btn success oi" dataGlyph="circle-check">
                        {lang.save}
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

const EditToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);

    return {
        menu_name: menu.m2,
        kfield: state.kfield,
        field: state.field
    }
}
const EditDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        submitData
    }, dispatch);
    return s;
}
let EditView = connect<{}, {}, {}>(EditToProps, EditDispatch)(Edit)

AddMasterMenu(TopNodeView, store, gb_menu_id);