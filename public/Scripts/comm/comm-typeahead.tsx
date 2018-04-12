import React = require('react');
import ReactDOM = require('react-dom');
import { fetchGet } from './ajax';
import "../../Content/css/vendor/typeahead.css";

interface SelectItem {
    value: string;
    text: string
}
interface ReactTypeaheadClass extends React.ComponentClass<ReactTypeaheadProps> {
}
interface ReactTypeaheadProps extends React.Props<ReactTypeaheadClass> {
    value?: string;
    placeholder?: string;
    wrapperClass?: string;
    inputClass?: string;
    onCompleteChange?(value: string, text: string, data: any): void;
    disabled?: boolean;
    required?: boolean;

    apiPath?: string;
    apiKeyName?: string; //webapi 接收參數名

    dataSource?: Array<any>

    dataKeyName?: string
    dataTextName?: string

    dataTextFunc?(data: any): string
}

interface ReactTypeaheadState {
    inputValue?: string
    visibility?: boolean
    tid?: any
    data?: Array<any>
    pointIndex?: number
    keyword?: string
}

export default class ReactTypeahead extends React.Component<ReactTypeaheadProps, ReactTypeaheadState> {

    tid: number = 0;

    constructor(props) {
        super(props)

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
            databy = []; // format {value:'value',text:'text'}

        if (pp.dataSource)
            databy = pp.dataSource;

        this.state = {
            inputValue: null,
            keyword: this.props.value,
            visibility: false,
            tid: null,
            data: databy,
            pointIndex: -1
        }
    }
    static defaultProps = {
        disabled: false,
        useSelect: true,
        required: false,
        apiKeyName: 'keyword',
        apiPath: null,
        dataSource: null,
        dataKeyName: 'value',
        dataTextName: 'text',
    };
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
            var f = function () { _self.getData(v) };

            clearTimeout(this.tid);
            this.tid = setTimeout(f, 500);

        } else {
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
        let idx = this.state.pointIndex
        this._CompleteClick(idx);
    }
    _CompleteClick(idx) {
        let pp = this.props

        let data = this.state.data[idx];
        let index_value = data[pp.dataKeyName];
        let text = this.state.data[idx][pp.dataTextName];
        this.props.onCompleteChange(index_value, text, data);
    }

    getData(q) {
        //console.log(new Date(), 'start query', q);
        clearTimeout(this.tid);
        this.tid = 0;
        if (this.state.keyword.trim() == '') {
            this.setState({
                visibility: false
            });
        } else {

            let pp = this.props;
            if (pp.apiPath) {
                fetchGet(pp.apiPath, { [pp.apiKeyName]: q })
                    .then((data: Array<any>) => {
                        this.setState({ data: data, visibility: true });
                    });
            } else if (pp.dataSource) {

                let n_data = pp.dataSource.filter((item, index, array) => {

                    let keyValue: string = item[pp.dataKeyName];
                    let textValue: string = item[pp.dataTextName];
                    return (keyValue.indexOf(q) > -1 || textValue.indexOf(q) > -1);
                });
                this.setState({ data: n_data, visibility: true });
            }
        }
    }
    keyDown(e) {
        if (e.keyCode == 40) { // key down
            if (this.state.pointIndex < this.state.data.length - 1) {
                let new_pos = this.state.pointIndex + 1;
                let index_value = this.state.data[new_pos]['value'];
                let index_text = this.state.data[new_pos]['text'];
                let show_text = index_text;

                this.setState({ pointIndex: new_pos, keyword: show_text });
            }
        }

        if (e.keyCode == 38) { //key up
            if (this.state.pointIndex > 0) {
                let new_pos = this.state.pointIndex - 1;
                let index_value = this.state.data[new_pos]['value'];
                let index_text = this.state.data[new_pos]['text'];
                let show_text = index_text;
                this.setState({ pointIndex: new_pos, keyword: show_text });
            }
        }

        if (e.keyCode == 13) { //key enter
            this.setState({ pointIndex: -1, visibility: false, keyword: '' }); //選定後清空input
            this._Complete();
        }

        if (e.keyCode == 27) { //key esc restroe value
            this.setState({ pointIndex: -1, visibility: false, keyword: this.props.value });
        }
    }
    onBlur(e) {
    }

    render() {
        let pp = this.props;

        var out_selector = null;
        if (this.state.visibility) {
            out_selector = <Selector
                data={this.state.data}
                pointIndex={this.state.pointIndex}
                onClickItem={this._onClickItem}
                dataKeyName={pp.dataKeyName}
                dataTextName={pp.dataTextName}
                dataTextFunc={pp.dataTextFunc}
            />;
        }
        return (
            <div className={"typeahead-group " + pp.wrapperClass}>
                <input type="text" value={this.state.keyword} placeholder={pp.placeholder}
                    className={pp.inputClass}
                    onChange={this.onChange}
                    onKeyDown={this.keyDown}
                    disabled={pp.disabled}
                    required={pp.required}
                />
                {out_selector}
            </div>
        );
    }
}
interface SelectorProps {
    onClickItem: Function
    pointIndex: number //目前光棒的索引位置
    data: any
    dataKeyName: string
    dataTextName: string
    dataTextFunc?(data: any): string
}

/**
 * 選項集合元素
 */
class Selector extends React.Component<SelectorProps, any> {

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    static defaultProps = {
        dataKeyName: 'value',
        dataTextName: 'text'
    };
    render() {
        let pp = this.props
        return (
            <div className="typeahead-panel list-group">
                {
                    pp.data.map((item, i) => {
                        return <Options
                            setClass={pp.pointIndex == i ? 'list-group-item active' : 'list-group-item'}
                            data={item}
                            index={i}
                            key={item[pp.dataKeyName]}
                            onClickItem={pp.onClickItem}
                            dataKeyName={pp.dataKeyName}
                            dataTextName={pp.dataTextName}
                            dataTextFunc={pp.dataTextFunc}
                        />
                    })
                }
            </div>
        );
    }
}

interface OptionsProps {
    setClass: string
    index: number //目前光棒的索引位置
    data: any
    dataKeyName: string
    dataTextName: string
    onClickItem: Function
    dataTextFunc?(data: any): string
}

/**
 * 選項物件
 */
class Options extends React.Component<OptionsProps, any> {
    constructor(props) {
        super(props)
        this._onClickItem = this._onClickItem.bind(this);
        this.state = {
        }
    }
    static defaultProps = {
        setClass: 'list-group-item'
    };
    _onClickItem(v, e) {
        this.props.onClickItem(this.props.index, v, e);
    }
    render() {
        let pp = this.props;
        return (
            <a className={this.props.setClass} href="#" onClick={this._onClickItem.bind(this, this.props.data[pp.dataKeyName])}>
                {
                    pp.dataTextFunc ? pp.dataTextFunc(pp.data) : this.props.data[pp.dataTextName]
                }
            </a>
        );
    }
}