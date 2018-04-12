"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ajax_1 = require("./ajax");
require("../../Content/css/vendor/typeahead.css");
class ReactTypeahead extends React.Component {
    constructor(props) {
        super(props);
        this.tid = 0;
        this.onChange = this.onChange.bind(this);
        this._onClickItem = this._onClickItem.bind(this);
        this._Complete = this._Complete.bind(this);
        this._CompleteClick = this._CompleteClick.bind(this);
        this.getData = this.getData.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        let pp = this.props;
        let databy = [];
        if (pp.apiPath)
            databy = [];
        if (pp.dataSource)
            databy = pp.dataSource;
        this.state = {
            inputValue: null,
            keyword: this.props.value,
            visibility: false,
            tid: null,
            data: databy,
            pointIndex: -1
        };
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({ keyword: nextProps.value });
        }
    }
    onChange(e) {
        var v = e.target.value;
        if (v.trim() != '') {
            this.setState({
                keyword: v
            });
            var _self = this;
            var f = function () { _self.getData(v); };
            clearTimeout(this.tid);
            this.tid = setTimeout(f, 500);
        }
        else {
            this.setState({
                keyword: v,
                visibility: false
            });
        }
    }
    _onClickItem(i, v, e) {
        this.setState({ visibility: false, keyword: '', pointIndex: i });
        this._CompleteClick(i);
    }
    _Complete() {
        let idx = this.state.pointIndex;
        this._CompleteClick(idx);
    }
    _CompleteClick(idx) {
        let pp = this.props;
        let data = this.state.data[idx];
        let index_value = data[pp.dataKeyName];
        let text = this.state.data[idx][pp.dataTextName];
        this.props.onCompleteChange(index_value, text, data);
    }
    getData(q) {
        clearTimeout(this.tid);
        this.tid = 0;
        if (this.state.keyword.trim() == '') {
            this.setState({
                visibility: false
            });
        }
        else {
            let pp = this.props;
            if (pp.apiPath) {
                ajax_1.fetchGet(pp.apiPath, { [pp.apiKeyName]: q })
                    .then((data) => {
                    this.setState({ data: data, visibility: true });
                });
            }
            else if (pp.dataSource) {
                let n_data = pp.dataSource.filter((item, index, array) => {
                    let keyValue = item[pp.dataKeyName];
                    let textValue = item[pp.dataTextName];
                    return (keyValue.indexOf(q) > -1 || textValue.indexOf(q) > -1);
                });
                this.setState({ data: n_data, visibility: true });
            }
        }
    }
    keyDown(e) {
        if (e.keyCode == 40) {
            if (this.state.pointIndex < this.state.data.length - 1) {
                let new_pos = this.state.pointIndex + 1;
                let index_value = this.state.data[new_pos]['value'];
                let index_text = this.state.data[new_pos]['text'];
                let show_text = index_text;
                this.setState({ pointIndex: new_pos, keyword: show_text });
            }
        }
        if (e.keyCode == 38) {
            if (this.state.pointIndex > 0) {
                let new_pos = this.state.pointIndex - 1;
                let index_value = this.state.data[new_pos]['value'];
                let index_text = this.state.data[new_pos]['text'];
                let show_text = index_text;
                this.setState({ pointIndex: new_pos, keyword: show_text });
            }
        }
        if (e.keyCode == 13) {
            this.setState({ pointIndex: -1, visibility: false, keyword: '' });
            this._Complete();
        }
        if (e.keyCode == 27) {
            this.setState({ pointIndex: -1, visibility: false, keyword: this.props.value });
        }
    }
    onBlur(e) {
    }
    render() {
        let pp = this.props;
        var out_selector = null;
        if (this.state.visibility) {
            out_selector = React.createElement(Selector, { data: this.state.data, pointIndex: this.state.pointIndex, onClickItem: this._onClickItem, dataKeyName: pp.dataKeyName, dataTextName: pp.dataTextName, dataTextFunc: pp.dataTextFunc });
        }
        return (React.createElement("div", { className: "typeahead-group " + pp.wrapperClass },
            React.createElement("input", { type: "text", value: this.state.keyword, placeholder: pp.placeholder, className: pp.inputClass, onChange: this.onChange, onKeyDown: this.keyDown, disabled: pp.disabled, required: pp.required }),
            out_selector));
    }
}
ReactTypeahead.defaultProps = {
    disabled: false,
    useSelect: true,
    required: false,
    apiKeyName: 'keyword',
    apiPath: null,
    dataSource: null,
    dataKeyName: 'value',
    dataTextName: 'text',
};
exports.default = ReactTypeahead;
class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let pp = this.props;
        return (React.createElement("div", { className: "typeahead-panel list-group" }, pp.data.map((item, i) => {
            return React.createElement(Options, { setClass: pp.pointIndex == i ? 'list-group-item active' : 'list-group-item', data: item, index: i, key: item[pp.dataKeyName], onClickItem: pp.onClickItem, dataKeyName: pp.dataKeyName, dataTextName: pp.dataTextName, dataTextFunc: pp.dataTextFunc });
        })));
    }
}
Selector.defaultProps = {
    dataKeyName: 'value',
    dataTextName: 'text'
};
class Options extends React.Component {
    constructor(props) {
        super(props);
        this._onClickItem = this._onClickItem.bind(this);
        this.state = {};
    }
    _onClickItem(v, e) {
        this.props.onClickItem(this.props.index, v, e);
    }
    render() {
        let pp = this.props;
        return (React.createElement("a", { className: this.props.setClass, href: "#", onClick: this._onClickItem.bind(this, this.props.data[pp.dataKeyName]) }, pp.dataTextFunc ? pp.dataTextFunc(pp.data) : this.props.data[pp.dataTextName]));
    }
}
Options.defaultProps = {
    setClass: 'list-group-item'
};
