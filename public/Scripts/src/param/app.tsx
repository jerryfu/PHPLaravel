import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import { PWButton, SelectText, InputText, InputNum, RadioText, FileUpBtn } from '../../comm/components';
import { DatePickText } from '../../comm/com-datepick';
import { setQueryValue, setInputValue, callLoad, submitData, cancel, returnGrid, store, setPage } from './pub'
import { getMenuName, stdDate, stdTime, stdNumber, isValidJSONDate } from '../../comm/comm-func';
import { config } from '../../comm/defData';
import { ft } from '../../comm/ajax';
import ap from '../../comm/api';
import Moment = require('moment');
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
        return <GridView />;
    }
}

//列表介面元件
interface GridProps {
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    web_param?: DotWeb.WebApp.Models.JsonWebParam.WebParam[],
    callLoad?: Function,
    setInputValue?: Function,
    submitData?: Function
}
class Grid extends React.Component<GridProps, any>{

    constructor() {
        super();
        this.chgFdlVal = this.chgFdlVal.bind(this);
        this.submit = this.submit.bind(this);
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
            // this.reloadQuery(null);
        }
    }
    keep_search;
    keep_field;
    keep_sort;

    chgFdlVal(i, value: any, e: React.SyntheticEvent<EventTarget>) {
        //let input: HTMLInputElement = e.target as HTMLInputElement;
        console.log(i, value);
        let struct = {
            [i]: {
                value: { $set: value }
            }
        };

        let n_state = update(this.props.web_param, struct);
        console.log(n_state)

        this.props.setInputValue(n_state);
    }
    chgFdl(name, e: React.SyntheticEvent<EventTarget>) {

        //let input: HTMLInputElement = e.target as HTMLInputElement;
        //let value = input.value;
        //let struct = {
        //    [name]: { $set: value }
        //};

        //let n_state = update(this.props.search, struct);
        //this.props.setQueryValue(n_state);


        //let structpage = {
        //    page: { $set: 1 }
        //};
        //let p_state = update(this.props.page_grid, structpage);
        //this.props.setPage(p_state);
    }

    submit(e) {
        e.preventDefault();
        this.props.submitData(this.props.web_param);
        return;
    }
    renderInput(i, item: DotWeb.WebApp.Models.JsonWebParam.WebParam) {
        ///console.log(typeof item.value);
        if (typeof item.value == 'number') {
            return <InputNum value={item.value} inputClassName="form-element" onChange={this.chgFdlVal.bind(this, i)} />;
        }
        else if (typeof item.value == 'string') {

            if (isValidJSONDate(item.value, null)) {
                return <DatePickText
                    inputClassName="form-element"
                    value={item.value}
                    onChange={this.chgFdlVal.bind(this, i)}
                />;
            } else {
                return <InputText type="text" value={item.value} inputClassName="form-element" onChange={this.chgFdlVal.bind(this, i)} />;
            }
        }
        else if (typeof item.value == 'boolean') {
            return <div>
                <RadioText
                    id={item.key + '_T'}
                    inputClassName="radio"
                    value={'true'}
                    checked={item.value == true}
                    onClick={this.chgFdlVal.bind(this, i)}
                />
                <label htmlFor={item.key + '_T'} />是
                <RadioText
                    id={item.key + '_F'}
                    inputClassName="radio"
                    value={'false'}
                    checked={item.value == false}
                    onClick={this.chgFdlVal.bind(this, i)}
                />
                <label htmlFor={item.key + '_F'} />否
            </div>
        }
        else {
            return <div></div>;
        }
    }

    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;
        out_html = <div>
            <h3 className="title">{this.props.menu_name}</h3>
            <form className="form-list" onSubmit={this.submit}>
                {
                    pp.web_param.map((item, i) => {
                        return <dl className="field">
                            <dt className="col-3">{item.field}</dt>
                            <dd className="col-5">
                                {this.renderInput(i, item)}
                            </dd>
                        </dl>;
                    })
                }
                <footer className="submit-bar mt-24">
                    <PWButton type="submit" className="btn sm success oi" dataGlyph="circle-check" enable={true}>
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

const GridToProps = (state, ownProps) => {
    let menu = getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        web_param: state.web_param,
        search: state.search,
        oper_id: state.oper_id
    }
}
const GridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        callLoad,
        submitData
    }, dispatch);
    return s;
}
let GridView = connect<{}, {}, {}>(GridToProps, GridDispatch)(Grid)

AddMasterMenu(TopNodeView, store, gb_menu_id);