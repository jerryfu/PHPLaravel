"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const update = require("react-addons-update");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const addMaster_1 = require("../inc/addMaster");
const components_1 = require("../../comm/components");
const com_datepick_1 = require("../../comm/com-datepick");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
class TopNode extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return React.createElement(GridView, null);
    }
}
class Grid extends React.Component {
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
        let pp = this.props;
        if (prevProps.oper_id != pp.oper_id) {
        }
    }
    chgFdlVal(i, value, e) {
        console.log(i, value);
        let struct = {
            [i]: {
                value: { $set: value }
            }
        };
        let n_state = update(this.props.web_param, struct);
        console.log(n_state);
        this.props.setInputValue(n_state);
    }
    chgFdl(name, e) {
    }
    submit(e) {
        e.preventDefault();
        this.props.submitData(this.props.web_param);
        return;
    }
    renderInput(i, item) {
        if (typeof item.value == 'number') {
            return React.createElement(components_1.InputNum, { value: item.value, inputClassName: "form-element", onChange: this.chgFdlVal.bind(this, i) });
        }
        else if (typeof item.value == 'string') {
            if (comm_func_1.isValidJSONDate(item.value, null)) {
                return React.createElement(com_datepick_1.DatePickText, { inputClassName: "form-element", value: item.value, onChange: this.chgFdlVal.bind(this, i) });
            }
            else {
                return React.createElement(components_1.InputText, { type: "text", value: item.value, inputClassName: "form-element", onChange: this.chgFdlVal.bind(this, i) });
            }
        }
        else if (typeof item.value == 'boolean') {
            return React.createElement("div", null,
                React.createElement(components_1.RadioText, { id: item.key + '_T', inputClassName: "radio", value: 'true', checked: item.value == true, onClick: this.chgFdlVal.bind(this, i) }),
                React.createElement("label", { htmlFor: item.key + '_T' }),
                "\u662F",
                React.createElement(components_1.RadioText, { id: item.key + '_F', inputClassName: "radio", value: 'false', checked: item.value == false, onClick: this.chgFdlVal.bind(this, i) }),
                React.createElement("label", { htmlFor: item.key + '_F' }),
                "\u5426");
        }
        else {
            return React.createElement("div", null);
        }
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let st = this.state;
        out_html = React.createElement("div", null,
            React.createElement("h3", { className: "title" }, this.props.menu_name),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                pp.web_param.map((item, i) => {
                    return React.createElement("dl", { className: "field" },
                        React.createElement("dt", { className: "col-3" }, item.field),
                        React.createElement("dd", { className: "col-5" }, this.renderInput(i, item)));
                }),
                React.createElement("footer", { className: "submit-bar mt-24" },
                    React.createElement(components_1.PWButton, { type: "submit", className: "btn sm success oi", dataGlyph: "circle-check", enable: true }, lang.save))));
        return out_html;
    }
}
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    };
};
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({}, dispatch);
    return s;
};
let TopNodeView = react_redux_1.connect(TopNodeToProps, TopNodeDispatch)(TopNode);
const GridToProps = (state, ownProps) => {
    let menu = comm_func_1.getMenuName(state.menudata);
    return {
        menu_name: menu.m2,
        edit_type: state.edit_type,
        web_param: state.web_param,
        search: state.search,
        oper_id: state.oper_id
    };
};
const GridDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        setInputValue: pub_1.setInputValue,
        callLoad: pub_1.callLoad,
        submitData: pub_1.submitData
    }, dispatch);
    return s;
};
let GridView = react_redux_1.connect(GridToProps, GridDispatch)(Grid);
addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);
