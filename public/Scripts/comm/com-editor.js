"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactQuill = require("react-quill");
require("../../Content/css/vendor/quill.snow.css");
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
];
let Inline = ReactQuill.Quill.import('blots/inline');
var icons = ReactQuill.Quill.import('ui/icons');
icons.h6 = `
<svg width="17px" height="12px" viewBox="0 0 17 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="h3" fill="currentColor">
            <path d="M9,1 L9,11 C9,11.5522847 8.55228475,12 8,12 C7.44771525,12 7,11.5522847 7,11 L7,7 L2,7 L2,11 C2,11.5522847 1.55228475,12 1,12 C0.44771525,12 0,11.5522847 0,11 L0,1 C-1.11022302e-16,0.44771525 0.44771525,0 1,0 C1.55228475,0 2,0.44771525 2,1 L2,5 L7,5 L7,1 C7,0.44771525 7.44771525,0 8,0 C8.55228475,0 9,0.44771525 9,1 Z" id="Shape" fill-rule="nonzero"></path>
            <text id="3" font-family="PingFangSC-Semibold, PingFang SC" font-size="9" font-weight="500">
                <tspan x="11.3" y="11">6</tspan>
            </text>
        </g>
    </g>
</svg>`;
class H6Blot extends Inline {
    static create(value) {
        let node = super.create();
        node.setAttribute('class', 'text-warning mb-4 mt-16');
        return node;
    }
    static value(node) {
        return {
            alt: node.getAttribute('alt')
        };
    }
}
H6Blot.blotName = 'h6';
H6Blot.tagName = 'h6';
H6Blot.attrName = 'h6';
ReactQuill.Quill.register('formats/h6', H6Blot);
let formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];
class EditorText extends React.Component {
    constructor() {
        super();
        this.quillRef = null;
        this.reactQuillRef = null;
        this.onChange = this.onChange.bind(this);
    }
    onChange(value, e) {
        this.props.onChange(value, e);
    }
    render() {
        let out_html = React.createElement("div", null, "Editor");
        let pp = this.props;
        let v = pp.value == undefined || pp.value == null ? "" : pp.value;
        let modules = {
            toolbar: pp.toolbarOptions ? pp.toolbarOptions : toolbarOptions
        };
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("div", null,
                    React.createElement(ReactQuill, { theme: "snow", value: v, onChange: this.onChange, modules: modules, formats: [...pp.formats, ...formats] },
                        React.createElement("div", { style: { height: "450px" }, className: pp.inputClassName }))));
        }
        return out_html;
    }
}
EditorText.defaultProps = {
    disabled: false,
    required: false,
    formats: [],
    inputViewMode: 1
};
exports.default = EditorText;
