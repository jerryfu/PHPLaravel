"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const defData_1 = require("./defData");
const moment = require("moment");
const Datetime = require("react-datetime");
require("../../Content/css/vendor/react-datetime.css");
class DateTimePickText extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(date) {
        let value = date == null ? null : date.format();
        this.props.onChange(value, this);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value = pp.value == undefined ? null : moment(pp.value).toDate();
        if (this.props.inputViewMode == 1) {
            out_html =
                (React.createElement(Datetime, { value: value, dateFormat: defData_1.config.dateFT, locale: "zh-TW", onChange: this.onChange, timeConstraints: { minutes: { min: 0, max: 59, step: 10 } }, className: pp.inputClassName }));
        }
        if (this.props.inputViewMode == 0) {
            out_html =
                (React.createElement("span", { className: this.props.viewClassName }, value));
        }
        return out_html;
    }
}
DateTimePickText.defaultProps = {
    disabled: false,
    required: false,
    inputViewMode: 1
};
exports.default = DateTimePickText;
