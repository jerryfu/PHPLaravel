"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactSuperSelect = require("react-super-select");
require("react-super-select/lib/react-super-select.css");
class ReactAutoSelectText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(option, e) {
        let value = option ? option.id : undefined;
        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(option.id), e);
        }
        else {
            this.props.onChange(value, e);
        }
    }
    render() {
        let out_html = null;
        let pp = this.props;
        var init_options = pp.options.filter(x => x.id == pp.value) ? pp.options.filter(x => x.id == pp.value) : [];
        if (this.props.inputViewMode == 1 && pp.options.length > 0) {
            if (init_options.length > 0) {
                out_html =
                    (React.createElement(ReactSuperSelect, { placeholder: pp.placeholder, clearSearchOnSelection: true, clearable: false, deselectOnSelectedOptionClick: false, searchable: true, dataSource: pp.options, initialValue: init_options, onChange: this.onChange, ajaxDataFetch: pp.ajaxDataFetch }));
            }
            else {
                out_html =
                    (React.createElement(ReactSuperSelect, { placeholder: pp.placeholder, clearSearchOnSelection: true, clearable: false, deselectOnSelectedOptionClick: false, searchable: true, dataSource: pp.options, onChange: this.onChange, ajaxDataFetch: pp.ajaxDataFetch }));
            }
        }
        if (this.props.inputViewMode == 0) {
            out_html = React.createElement("span", { className: this.props.viewClassName, id: this.props.id });
            this.props.options.forEach((item, i) => {
                if (item.id == this.props.value) {
                    if (this.props.show_type == 1)
                        out_html = React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, item.name);
                    if (this.props.show_type == 0)
                        out_html = React.createElement("span", { id: this.props.id, className: this.props.viewClassName }, item.id);
                }
            });
        }
        return out_html;
    }
}
ReactAutoSelectText.defaultProps = {
    placeholder: "請選擇",
    disabled: false,
    inputViewMode: 1,
    required: false,
    is_blank: false,
    blank_text: lang.option_blank,
    show_type: 1,
    is_int_type: false,
    options: []
};
exports.ReactAutoSelectText = ReactAutoSelectText;
