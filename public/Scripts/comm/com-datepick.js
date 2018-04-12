"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
const react_datepicker_1 = require("react-datepicker");
const defData_1 = require("./defData");
require("../../Content/css/vendor/react-datepicker.css");
class DatePickText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(date) {
        let value = date == null ? null : date.format();
        this.props.onChange(value, this);
    }
    render() {
        let out_html = React.createElement("div", null, "Test");
        let pp = this.props;
        let value = pp.value == undefined ? null : moment(pp.value);
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement("div", { style: { display: 'inline-block' } },
                    React.createElement(react_datepicker_1.default, { selected: value, dateFormat: defData_1.config.dateFT, isClearable: true, required: pp.required, locale: "zh-TW", showYearDropdown: true, onChange: this.onChange, disabled: pp.disabled, minDate: pp.minDate, maxDate: pp.maxDate, className: pp.inputClassName })));
        }
        return out_html;
    }
}
DatePickText.defaultProps = {
    disabled: false,
    required: false,
    inputViewMode: 1
};
exports.DatePickText = DatePickText;
