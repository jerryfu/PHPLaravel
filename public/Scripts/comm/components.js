"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const comm_func_1 = require("./comm-func");
const defData_1 = require("./defData");
const Modal = require("react-modal");
const FileUpload = require("react-fileupload");
const ajax_1 = require("./ajax");
class InputText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.prvText = null;
    }
    onChange(e) {
        let input = e.target;
        let value = comm_func_1.makeInputValue(e);
        this.props.onChange(value, e);
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        let set_value = value;
        let testZH = (src) => {
            for (var i = 0; i < src.length; i++) {
                if (src.charCodeAt(i) > 255) {
                    return true;
                }
            }
            return false;
        };
        if (this.props.notChinese && testZH(value))
            set_value = this.prvText;
        else
            this.prvText = value;
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("input", { id: this.props.id, type: this.props.type, className: this.props.inputClassName, width: this.props.width, style: this.props.style, value: set_value, onChange: this.onChange, disabled: this.props.disabled, required: this.props.required, maxLength: this.props.maxLength, onBlur: this.props.onBlur, onFocus: this.props.onFocus, tabIndex: this.props.tabIndex, pattern: this.props.patternString, title: this.props.patternInfo, placeholder: this.props.placeholder, "data-for": this.props.dataFor, "data-tip": this.props.dataTip }));
        }
        if (this.props.inputViewMode == 0) {
            out_html =
                (React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, set_value));
        }
        return out_html;
    }
}
InputText.defaultProps = {
    type: 'text',
    disabled: false,
    inputViewMode: 1,
    notChinese: false
};
exports.InputText = InputText;
class InputNum extends React.Component {
    constructor() {
        super();
        this.is_get_value = false;
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.state = {
            show_value: null,
            prv_value: null,
            neg_sign_flag: false
        };
    }
    componentDidMount() {
        const pp_value = this.props.value;
        this.setState({ show_value: pp_value, prv_value: pp_value });
    }
    componentWillUpdate(nextProps, nextState) {
        if (comm_func_1.isNumeric(this.props.value) && comm_func_1.isNumeric(nextState.show_value) && this.props.value != nextState.show_value) {
            nextState.show_value = this.props.value;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.value != prevProps.value && comm_func_1.isNumeric(this.props.value)) {
            const pp_value = this.props.value;
            this.setState({ prv_value: pp_value, show_value: pp_value });
        }
        else if (this.props.value != prevProps.value && (this.props.value == null || this.props.value == '')) {
            this.setState({ prv_value: '', show_value: '' });
        }
    }
    onChange(e) {
        if (this.props.onChange == undefined || this.props.onChange == null)
            return;
        let input = e.target;
        let value = input.value;
        if (value === null || value === '' || value === null || value === undefined) {
            this.setState({ prv_value: null, show_value: null });
            this.props.onChange('', e);
        }
        else {
            if (value == '-' && !this.props.onlyPositive) {
                this.setState({ show_value: '-', prv_value: value });
                this.props.onChange(0, e);
            }
            else if (value == '-' && this.props.onlyPositive) {
                this.setState({ show_value: '', prv_value: '' });
                this.props.onChange('', e);
            }
            else if (value == '.') {
                this.setState({ show_value: '.', prv_value: value });
                this.props.onChange(0, e);
            }
            else if (comm_func_1.isNumeric(value)) {
                let n = parseFloat(value);
                if (this.props.onlyPositive && n < 0) {
                    const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                    this.setState({ show_value: prv_value });
                    this.props.onChange(prv_value, e);
                }
                else {
                    if (n == 0 && !(value.indexOf('.') > -1)) {
                        this.setState({ show_value: n, prv_value: n });
                    }
                    else {
                        this.setState({ show_value: value.trim(), prv_value: n });
                    }
                    this.props.onChange(n, e);
                }
            }
            else {
                const prv_value = (this.state.prv_value === undefined || this.state.prv_value === null) ? '' : this.state.prv_value;
                this.setState({ show_value: prv_value });
                this.props.onChange(prv_value, e);
            }
        }
    }
    onBlur(e) {
        let input = e.target;
        let value = input.value;
        let pp = this.props;
        if (value === '-') {
            this.setState({ show_value: '', prv_value: '' });
            pp.onChange('', e);
        }
        else {
            if (pp.min != undefined && pp.min != null && pp.value.toString() != '' && pp.value < pp.min) {
                this.setState({ show_value: '', prv_value: '' });
                pp.onChange('', e);
            }
            if (pp.max != undefined && pp.max != null && pp.value.toString() != '' && pp.value > pp.max) {
                this.setState({ show_value: '', prv_value: this.state.prv_value });
                alert(`最大值不可超過${pp.max}!`);
                pp.onChange('', e);
            }
        }
        if (this.props.onBlur)
            this.props.onBlur(e);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let set_style = null;
        if (this.props.style)
            set_style = this.props;
        else if (this.props.hidden)
            set_style = { display: 'none' };
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("input", { id: pp.id, type: "text", className: pp.inputClassName, width: pp.width, style: pp.style, value: this.state.show_value, onChange: this.onChange, disabled: pp.disabled, required: pp.required, maxLength: pp.maxLength, onBlur: this.onBlur, onFocus: pp.onFocus, tabIndex: pp.tabIndex, "data-group": pp.group, title: pp.title, "data-for": pp.dataFor, "data-tip": pp.dataTip, readOnly: pp.readyonly }));
        }
        if (this.props.inputViewMode == 0) {
            out_html =
                (React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, pp.moneyFmt ? comm_func_1.fmtMoney(this.state.show_value) : this.state.show_value));
        }
        return out_html;
    }
}
InputNum.defaultProps = {
    type: 'text',
    disabled: false,
    inputViewMode: 1,
    only_positive: true,
    moneyFmt: true
};
exports.InputNum = InputNum;
class SelectText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        exports.SetSelectEdge(this.refs.select);
    }
    componentDidUpdate(prevProps, prevState) {
        exports.SetSelectEdge(this.refs.select);
    }
    onChange(e) {
        let input = e.target;
        let value = comm_func_1.makeInputValue(e);
        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(value), e);
        }
        else {
            this.props.onChange(value, e);
        }
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value.toString();
        if (this.props.inputViewMode == 1) {
            let blank_option = this.props.is_blank ? React.createElement("option", { value: "" }, this.props.blank_text) : '';
            out_html =
                (React.createElement("select", { ref: "select", id: this.props.id, className: this.props.inputClassName, value: value, onChange: this.onChange, disabled: this.props.disabled, required: this.props.required, "data-group": this.props.group },
                    blank_option,
                    this.props.options.map((item, i) => {
                        if (item.value == this.props.value) {
                            return React.createElement("option", { key: i, value: item.value, defaultValue: item.value }, item.label);
                        }
                        else {
                            return React.createElement("option", { key: i, value: item.value }, item.label);
                        }
                    })));
        }
        if (this.props.inputViewMode == 0) {
            out_html = React.createElement("span", { className: this.props.viewClassName, id: this.props.id });
            this.props.options.forEach((item, i) => {
                if (item.value == this.props.value) {
                    if (this.props.show_type == 1)
                        out_html = React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, item.label);
                    if (this.props.show_type == 0)
                        out_html = React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, item.value);
                }
            });
        }
        return out_html;
    }
}
SelectText.defaultProps = {
    disabled: false,
    inputViewMode: 1,
    required: false,
    is_blank: false,
    blank_text: lang.option_blank,
    show_type: 1,
    is_int_type: false
};
exports.SelectText = SelectText;
class AreaText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        let input = e.target;
        let value = comm_func_1.makeInputValue(e);
        this.props.onChange(value, e);
    }
    areaTextBr(val) {
        return val.replace(defData_1.config.RegNewLineBR, "<br />");
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        const pp = this.props;
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("textarea", { id: pp.id, name: pp.name, className: this.props.inputClassName, onChange: this.onChange, disabled: pp.disabled, rows: pp.rows, cols: pp.cols, required: pp.required, style: pp.style, value: value, defaultValue: pp.defaultValue, maxLength: pp.maxLength, placeholder: pp.placeholder }));
        }
        if (this.props.inputViewMode == 0) {
            if (this.props.isHtml) {
                out_html =
                    (React.createElement("span", { id: this.props.id, className: this.props.viewClassName, dangerouslySetInnerHTML: { __html: this.areaTextBr(value.toString()) } }));
            }
            else {
                out_html =
                    (React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, value));
            }
        }
        return out_html;
    }
}
AreaText.defaultProps = {
    disabled: false,
    isHtml: false,
    inputViewMode: 1
};
exports.AreaText = AreaText;
exports.SetSelectEdge = (obj) => {
    if (!/Edge\/\d./i.test(navigator.userAgent)) {
        return;
    }
    let selectedIndex = -1;
    if (obj) {
        selectedIndex = obj.selectedIndex;
    }
    if (selectedIndex >= 0) {
        const inputDOM = ReactDOM.findDOMNode(obj);
        let tempOption;
        if (inputDOM.childNodes.length === 1) {
            tempOption = document.createElement('option');
            inputDOM.appendChild(tempOption);
        }
        const options = obj.options;
        const tempIndex = (selectedIndex + 1) % options.length;
        options[tempIndex].selected = true;
        options[selectedIndex].selected = true;
        if (tempOption) {
            inputDOM.removeChild(tempOption);
        }
    }
};
class FileUpBtn extends React.Component {
    constructor() {
        super();
        this.options_file = null;
        this.up_path = gb_approot + 'FileHdl/Up';
        this.ls_path = gb_approot + 'FileHdl/List';
        this.de_path = gb_approot + 'FileHdl/Del';
        this.dw_path = gb_approot + 'FileHdl/Down';
        this.onClick = this.onClick.bind(this);
        this.close = this.close.bind(this);
        this.listFile = this.listFile.bind(this);
        this.down = this.down.bind(this);
        this.delete = this.delete.bind(this);
        this.state = {
            is_open: false,
            cho_name: '未選擇',
            files: [],
            filescope: null
        };
    }
    componentDidMount() {
        this.listFile();
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props;
        if (!prevProps.id && pp.id) {
            this.listFile();
        }
    }
    listFile() {
        let pp = this.props;
        if (pp.id && pp.fileKey) {
            let p = {
                id: pp.id,
                key: pp.fileKey
            };
            ajax_1.fetchGet(this.ls_path, p).then((data) => {
                if (data.state == 0) {
                    this.setState({ files: data.files, cho_name: '未選擇', filescope: data.filescope });
                }
            });
        }
    }
    onClick(e) {
        this.setState({ is_open: true });
    }
    close(e) {
        this.setState({ is_open: false });
    }
    down(guid, e) {
        let pp = this.props;
        let pack_param = {
            id: pp.id,
            key: pp.fileKey,
            guid: guid
        };
        ifrmDown(this.dw_path, pack_param);
    }
    delete(guid, e) {
        if (confirm(lang.delete_sure)) {
            let pp = this.props;
            let pa = {
                id: pp.id,
                key: pp.fileKey,
                guid: guid
            };
            ajax_1.fetchPost(this.de_path, pa).then((data) => {
                if (data.state == 0) {
                    this.listFile();
                    if (this.props.hub) {
                        this.props.hub.server.getListFile();
                    }
                }
                else if (data.state == 1) {
                    alert('無此檔案');
                }
                else if (data.state == 1000)
                    alert(data.message);
            });
        }
    }
    render() {
        let out_html = null;
        let link = null;
        let st = this.state;
        let pp = this.props;
        if (!st.filescope)
            return null;
        let n_file = React.createElement("span", null, this.props.upload_text);
        let y_file = React.createElement("span", null, this.props.finish_text);
        link = React.createElement("a", { className: st.files.length > 0 ? this.props.inputWithDataClassName : this.props.inputClassName, href: "#", onClick: this.onClick, "data-glyph": "image" }, st.files.length > 0 ? y_file : n_file);
        let _self = this;
        let accept = _self.state.filescope.allowExtType.join(',');
        this.options_file = {
            baseUrl: this.up_path,
            param: {
                _: (new Date()).getTime()
            },
            dataType: 'json',
            wrapperDisplay: 'block',
            multiple: false,
            numberLimit: 1,
            accept: accept,
            chooseAndUpload: false,
            paramAddToField: {
                key: pp.fileKey,
                id: pp.id,
            },
            fileFieldName: 'fileObject',
            withCredentials: false,
            beforeChoose: function () {
                return true;
            },
            chooseFile: function (files) {
                var f = typeof files == 'string' ? files : files[0].name;
                _self.setState({ cho_name: f });
                return f;
            },
            beforeUpload: function (files, mill) {
                if (typeof files == 'string')
                    return true;
                if (files[0].size < 1024 * 1024 * 38) {
                    files[0].mill = mill;
                    return true;
                }
                else {
                    comm_func_1.tosMessage('檔案上傳狀態', '檔案太大，需小於38MB!', 3);
                }
                return false;
            },
            doUpload: function (files, mill) {
            },
            uploading: function (progress) {
                var n = comm_func_1.floatSpot(progress.loaded / progress.total * 100, 2);
                _self.setState({ cho_name: n + '%' });
            },
            uploadSuccess: function (resp) {
                if (resp.state == 0) {
                    _self.listFile();
                    comm_func_1.tosMessage('檔案上傳狀態', '上傳完成', 1);
                    if (_self.props.hub) {
                        _self.props.hub.server.getListFile();
                    }
                }
                else if (resp.state == 1)
                    comm_func_1.tosMessage('檔案上傳狀態', '檔案容量超過限制，最大為' + comm_func_1.formatFileSize(st.filescope.limitSize) + '。', 3);
                else if (resp.state == 2)
                    comm_func_1.tosMessage('檔案上傳狀態', '檔案數量超過限制:' + st.filescope.limitCount, 3);
                else if (resp.state == 3)
                    comm_func_1.tosMessage('檔案上傳狀態', '檔案類型不允許上傳。', 3);
                else
                    comm_func_1.tosMessage('檔案上傳狀態', resp.message, 3);
            },
            uploadError: function (err) {
                alert('uploadError:' + err.message);
            },
            uploadFail: function (resp) {
                alert(resp);
            }
        };
        let enabled = true;
        if (pp.is_model) {
            out_html = React.createElement("div", null,
                link,
                React.createElement(Modal, { isOpen: st.is_open, className: defData_1.config.modalMd, overlayClassName: defData_1.config.modalOverlay, contentLabel: "No Overlay Click Modal" },
                    React.createElement("section", { className: "modal-content animate-top" },
                        React.createElement("header", null, this.props.title),
                        React.createElement("button", { type: "button", onClick: this.close, className: defData_1.config.modalClose }, lang.close),
                        React.createElement("div", { className: "react-file-upload form-list" },
                            !pp.disabled ? React.createElement("dl", { className: "fields" },
                                React.createElement("dt", { className: "col-2" }, this.props.title),
                                React.createElement("dd", { className: "col-10 text-left" }, (st.files.length < st.filescope.limitCount) ?
                                    React.createElement(FileUpload, { options: this.options_file },
                                        React.createElement("div", { ref: "chooseBtn", className: "input-file" },
                                            React.createElement("strong", { className: "oi", "data-glyph": "magnifying-glass" }, "\u8ACB\u9078\u64C7\u6A94\u6848"),
                                            React.createElement("label", null, this.state.cho_name)),
                                        React.createElement("div", { ref: "uploadBtn" },
                                            React.createElement("button", { type: "button", className: "btn success oi", "data-glyph": "data-transfer-upload" }, "\u6A94\u6848\u4E0A\u50B3")))
                                    : null)) : null,
                            st.files.length > 0 ?
                                React.createElement("dl", { className: "fields" },
                                    React.createElement("dt", { className: "col-2" }, "\u5DF2\u4E0A\u50B3\u6A94\u6848\u6E05\u55AE"),
                                    React.createElement("dd", { className: "col-10" }, this.state.files.map((item, i) => {
                                        return React.createElement("div", { className: "uploaded oi", "data-glyph": "paperclip", key: item.fileName + '_' + i },
                                            React.createElement("button", { type: "button", onClick: this.delete.bind(this, item.guid), disabled: pp.disabled, className: "btn-link oi", title: "刪除此筆檔案", "data-glyph": "x" }),
                                            pp.is_img ?
                                                React.createElement("a", { href: "#", onClick: this.down.bind(this, item.guid) },
                                                    React.createElement("img", { src: item.iconPath, alt: item.fileName })) :
                                                React.createElement("a", { href: "#", onClick: this.down.bind(this, item.guid) }, item.fileName));
                                    }))) : React.createElement("dl", { className: "field mt-24" },
                                React.createElement("dt", { className: "col-12" },
                                    React.createElement("p", { className: "alert-warning text-center" }, "\u76EE\u524D\u7121\u4E0A\u50B3\u4EFB\u4F55\u6A94\u6848")))),
                        React.createElement("footer", { className: "text-left" },
                            React.createElement("ol", null,
                                React.createElement("li", null,
                                    "\u672C\u7CFB\u7D71\u5141\u8A31\u4E0A\u50B3 ",
                                    this.props.accept_text,
                                    " \u985E\u578B\u7684\u6A94\u6848\u3002"),
                                React.createElement("li", null,
                                    "\u55AE\u500B\u6A94\u6848\u5927\u5C0F\u4E0D\u80FD\u8D85\u904E ",
                                    comm_func_1.formatFileSize(st.filescope.limitSize),
                                    "\uFF0C\u6700\u591A\u53EF\u4E0A\u50B3 ",
                                    st.filescope.limitCount,
                                    " \u500B\u6A94\u6848\uFF0C\u8B1D\u8B1D\uFF01"))))));
        }
        else {
            out_html = React.createElement("div", { className: "react-file-upload" },
                !pp.disabled ? [React.createElement("div", { className: "input-file", key: "file-up" }, (st.files.length < st.filescope.limitCount) ? React.createElement(FileUpload, { options: this.options_file },
                        React.createElement("label", { ref: "chooseBtn", className: "align-middle" }, this.state.cho_name),
                        React.createElement("button", { ref: "uploadBtn", type: "button", disabled: pp.disabled, className: "btn warning sm oi", "data-glyph": "data-transfer-upload" }, "\u6A94\u6848\u4E0A\u50B3")) : null),
                    React.createElement("div", { className: "font-sm", key: "file-info" },
                        "\u672C\u7CFB\u7D71\u5141\u8A31\u4E0A\u50B3 ",
                        st.filescope.allowExtType,
                        " \u985E\u578B\u7684\u6A94\u6848\u3002",
                        React.createElement("br", null),
                        "\u55AE\u500B\u6A94\u6848\u5927\u5C0F\u5EFA\u8B70\u4E0D\u8D85\u904E ",
                        comm_func_1.formatFileSize(st.filescope.limitSize),
                        "\uFF0C\u6700\u591A\u53EF\u4E0A\u50B3 ",
                        st.filescope.limitCount,
                        " \u500B\u6A94\u6848\uFF0C\u8B1D\u8B1D\uFF01",
                        (st.filescope.Parm.length > 0) ? React.createElement("span", null,
                            React.createElement("br", null),
                            "\u6700\u4F73\u700F\u89BD\u5C3A\u5BF8: ",
                            st.filescope.Parm[0].heigh ? "高度不超過 " + st.filescope.Parm[0].heigh + " px, " : null,
                            st.filescope.Parm[0].width ? "寬度不超過 " + st.filescope.Parm[0].width + " px" : null) : null)] : ((st.files.length <= 0) ? React.createElement("p", null, "\u7121\u4E0A\u50B3\u4EFB\u4F55\u6A94\u6848") : null),
                st.files.length > 0 ?
                    React.createElement("div", { className: "uploaded-list" }, this.state.files.map((item, i) => {
                        return React.createElement("div", { className: "uploaded", key: item.fileName + '_' + i },
                            !pp.disabled ?
                                React.createElement("button", { type: "button", onClick: this.delete.bind(this, item.guid), className: "close", title: "刪除此筆檔案" }, "\u00D7") :
                                null,
                            pp.is_img ?
                                React.createElement("a", { href: "#", onClick: this.down.bind(this, item.guid) },
                                    React.createElement("img", { src: item.iconPath, alt: item.fileName })) :
                                React.createElement("a", { href: "#", onClick: this.down.bind(this, item.guid), className: "oi", "data-glyph": "paperclip" }, item.fileName));
                    })) : null);
        }
        return out_html;
    }
}
FileUpBtn.defaultProps = {
    disabled: false,
    inputViewMode: 1,
    inputClassName: 'btn oi success',
    inputWithDataClassName: 'btn oi warning',
    title: '檔案上傳',
    isCopyLastYear: false,
    upload_text: '檔案上傳',
    finish_text: '檢視資料',
    is_img: false,
    accepts: ' .jpg, .jpeg, .png',
    accept_text: 'JPG, JPEG, PNG',
    haveRolesSet: false,
    roles: [],
    role: null,
    is_model: false
};
exports.FileUpBtn = FileUpBtn;
class RadioText extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        let input = e.target;
        let value = comm_func_1.makeInputValue(e);
        this.props.onClick(value, e);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value = pp.value == undefined ? '' : pp.value;
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("input", { id: pp.id, type: "radio", name: pp.name, className: pp.inputClassName, style: pp.style, value: value, onClick: this.onClick, disabled: pp.disabled, required: pp.required, onFocus: pp.onFocus, tabIndex: pp.tabIndex, checked: pp.checked }));
        }
        if (this.props.inputViewMode == 0) {
            if (pp.checked) {
                out_html =
                    (React.createElement("span", { id: pp.id, className: pp.viewClassName }, pp.trueSign));
            }
            else {
                out_html =
                    (React.createElement("span", { id: pp.id, className: pp.viewClassName }, pp.fasleSign));
            }
        }
        return out_html;
    }
}
RadioText.defaultProps = {
    disabled: false,
    inputViewMode: 1,
    checked: false,
    trueSign: '',
    fasleSign: ''
};
exports.RadioText = RadioText;
class CheckText extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        this.props.onClick(!this.props.checked, e);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value = this.props.value == undefined ? '' : this.props.value;
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("input", { id: this.props.id, type: "checkbox", className: pp.inputClassName, style: pp.style, value: value, onClick: this.onClick, disabled: pp.disabled, required: pp.required, onFocus: pp.onFocus, tabIndex: pp.tabIndex, checked: pp.checked, "data-for": pp.dataFor, "data-tip": pp.dataTip }));
        }
        if (this.props.inputViewMode == 0) {
            if (!this.props.viewShowCheck)
                return React.createElement("span", null);
            if (this.props.checked) {
                out_html =
                    (React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, this.props.trueSign));
            }
            else {
                out_html =
                    (React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, this.props.fasleSign));
            }
        }
        return out_html;
    }
}
CheckText.defaultProps = {
    disabled: false,
    inputViewMode: 1,
    checked: false,
    trueSign: '',
    fasleSign: '',
    viewShowFalse: false
};
exports.CheckText = CheckText;
class PWButton extends React.Component {
    constructor() {
        super();
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let set_style = null;
        if (pp.style)
            set_style = pp.style;
        else if (this.props.hidden)
            set_style = { display: 'none' };
        let enabled = true;
        enabled = enabled && pp.enable;
        out_html =
            (React.createElement("button", { type: pp.type, title: pp.title, name: pp.name, className: pp.className, onClick: pp.onClick, disabled: !enabled, id: pp.id, style: set_style, "data-for": pp.dataFor, "data-tip": pp.dataTip, "data-glyph": pp.dataGlyph }, pp.children));
        return out_html;
    }
}
PWButton.defaultProps = {
    enable: true,
    type: 'button',
    hidden: false,
    roles: [],
    role: null
};
exports.PWButton = PWButton;
function ifrmDown(download_src, pm) {
    let param = [];
    for (var i in pm)
        param.push(i + '=' + encodeURIComponent(pm[i]));
    let join_param = param.join('&');
    $('#file_down').remove();
    var item = $(this).attr('item');
    var url_append_param = download_src + '?' + join_param;
    var ifram = $('<iframe id="file_down" style="display:none">');
    ifram.attr('src', url_append_param);
    $(document.body).append(ifram);
}
exports.ifrmDown = ifrmDown;
class PageFooter extends React.Component {
    constructor() {
        super();
        this.packSearch = this.packSearch.bind(this);
        this.clkFirstPage = this.clkFirstPage.bind(this);
        this.clkPrvePage = this.clkPrvePage.bind(this);
        this.clkNextPage = this.clkNextPage.bind(this);
        this.clkLastPage = this.clkLastPage.bind(this);
        this.clkJumpPage = this.clkJumpPage.bind(this);
        this.state = {};
    }
    packSearch(p) {
        const r = Object.assign(this.props.search, p);
        return r;
    }
    clkLastPage(e) {
        const p = this.packSearch({ page: this.props.page_grid.total });
        this.props.callPage(p);
    }
    clkNextPage(e) {
        const page = this.props.page_grid.page + 1;
        const p = this.packSearch({ page: page });
        this.props.callPage(p);
    }
    clkPrvePage(e) {
        const page = this.props.page_grid.page - 1;
        const p = this.packSearch({ page: page });
        this.props.callPage(p);
    }
    clkFirstPage(e) {
        let p = this.packSearch({ page: 1 });
        this.props.callPage(p);
    }
    clkJumpPage(e) {
        let input = e.target;
        let p = this.packSearch({ page: input.value });
        this.props.callPage(p);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let st = this.state;
        out_html = React.createElement("footer", { className: "table-foot" },
            React.createElement("small", { className: "pull-right" },
                "\u7B2C ",
                pp.page_grid.startcount,
                "-",
                pp.page_grid.endcount,
                " \u7B46\uFF0C\u5171 ",
                pp.page_grid.records,
                " \u7B46"),
            React.createElement("nav", { className: "pager" },
                React.createElement("button", { type: "button", className: "oi", "data-glyph": "media-step-backward", title: "到最前頁", onClick: this.clkFirstPage, disabled: pp.page_grid.page <= 1 }),
                React.createElement("button", { type: "button", className: "oi", "data-glyph": "chevron-left", title: "上一頁", onClick: this.clkPrvePage, disabled: pp.page_grid.page <= 1 }),
                React.createElement("span", null,
                    "\u7B2C",
                    React.createElement("input", { className: "text-center", type: "number", value: pp.page_grid.page, onChange: this.clkJumpPage }),
                    "\u9801\uFF0C\u5171 ",
                    pp.page_grid.total,
                    "\u9801"),
                React.createElement("button", { type: "button", className: "oi", title: "下一頁", "data-glyph": "chevron-right", onClick: this.clkNextPage, disabled: pp.page_grid.page >= pp.page_grid.total }),
                React.createElement("button", { type: "button", className: "oi", title: "到最後頁", "data-glyph": "media-step-forward", onClick: this.clkLastPage, disabled: pp.page_grid.page >= pp.page_grid.total })));
        return out_html;
    }
}
exports.PageFooter = PageFooter;
