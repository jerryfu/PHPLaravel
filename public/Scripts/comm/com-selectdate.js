"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Moment = require("moment");
const comm_func_1 = require("../comm/comm-func");
class CSelectDate extends React.Component {
    constructor() {
        super();
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.changeDay = this.changeDay.bind(this);
        this.state = {
            _y_value: null,
            _m_value: null,
            _d_value: null,
            is_leap: false
        };
    }
    componentDidUpdate(prevProps, prevState) {
    }
    changeYear(e) {
        let input = e.target;
        if (input.value != '') {
            let value = parseInt(input.value, 10);
            let MT;
            if (this.props.value == null) {
                let _test_days = value + '-01-01';
                MT = Moment(_test_days);
            }
            else {
                MT = this.props.value;
            }
            let _m = MT.month();
            let _d = MT.date();
            let _test_days = value + '-' + comm_func_1.pad((_m + 1).toString(), 2, '0', 1) + '-01';
            let MM = Moment(_test_days);
            if (_d > MM.daysInMonth()) {
                _d = MM.daysInMonth();
            }
            let _str_date = value + '-' + comm_func_1.pad((_m + 1).toString(), 2, '0', 1) + '-' + comm_func_1.pad(_d.toString(), 2, '0', 1) + ' 00:00';
            ;
            let _date = Moment(_str_date, 'YYYY-MM-DD');
            this.props.onChange(_date);
        }
        else {
            this.props.onChange(null);
        }
    }
    changeMonth(e) {
        let input = e.target;
        let value = parseInt(input.value, 10);
        let MT = this.props.value;
        let _y = MT.year();
        let _d = MT.date();
        let _test_days = _y + '-' + comm_func_1.pad(value.toString(), 2, '0', 1) + '-01';
        let MM = Moment(_test_days);
        if (_d > MM.daysInMonth()) {
            _d = MM.daysInMonth();
        }
        let _str_date = _y + '-' + comm_func_1.pad(value.toString(), 2, '0', 1) + '-' + comm_func_1.pad(_d.toString(), 2, '0', 1) + ' 00:00';
        let _date = Moment(_str_date, 'YYYY-MM-DD');
        this.props.onChange(_date);
    }
    changeDay(e) {
        let input = e.target;
        let MT = this.props.value;
        let _y = MT.year();
        let _m = MT.month();
        let _d = parseInt(input.value, 10);
        let _str_date = _y + '-' + comm_func_1.pad((_m + 1).toString(), 2, '0', 1) + '-' + comm_func_1.pad(_d.toString(), 2, '0', 1) + ' 00:00';
        let _date = Moment(_str_date);
        this.props.onChange(_date);
    }
    render() {
        let out_html = null;
        let MM = this.props.value;
        if (this.props.inputViewMode == 0) {
            if (MM == null) {
                out_html = React.createElement("span", null,
                    '',
                    " ");
            }
            else {
                let MM_Y = MM.year();
                let MM_M = MM.month();
                let MM_D = MM.date();
                let CDateText = "";
                out_html = React.createElement("span", null,
                    CDateText,
                    " ");
            }
        }
        if (this.props.inputViewMode == 1) {
            let MM_Y = MM == null ? '' : MM.year().toString();
            let MM_M = MM == null ? null : MM.month().toString();
            let MM_D = MM == null ? null : MM.date().toString();
            let _min_year = this.props.min_year;
            let _max_year = this.props.max_year;
            let _y = [];
            let _d = [];
            for (var i = _min_year; i <= _max_year; i++) {
                _y.push(i);
            }
            let m1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let m2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let _leap_day = [];
            if (MM != null) {
                _d = MM.isLeapYear() ? m2 : m1;
                for (var i = 1; i <= _d[MM_M]; i++) {
                    _leap_day.push(i);
                }
            }
            out_html =
                (React.createElement("span", null,
                    React.createElement("select", { ref: "y_idx", className: this.props.inputClassName, value: MM_Y, onChange: this.changeYear, disabled: this.props.disabled, required: this.props.required },
                        React.createElement("option", { value: "" }),
                        _y.map((item, i) => {
                            return React.createElement("option", { key: item, value: item }, item);
                        })),
                    React.createElement("select", { ref: "m_idx", className: this.props.inputClassName, value: (parseInt(MM_M) + 1), onChange: this.changeMonth, disabled: MM == null, required: this.props.required },
                        React.createElement("option", { value: "1" }, "1"),
                        React.createElement("option", { value: "2" }, "2"),
                        React.createElement("option", { value: "3" }, "3"),
                        React.createElement("option", { value: "4" }, "4"),
                        React.createElement("option", { value: "5" }, "5"),
                        React.createElement("option", { value: "6" }, "6"),
                        React.createElement("option", { value: "7" }, "7"),
                        React.createElement("option", { value: "8" }, "8"),
                        React.createElement("option", { value: "9" }, "9"),
                        React.createElement("option", { value: "10" }, "10"),
                        React.createElement("option", { value: "11" }, "11"),
                        React.createElement("option", { value: "12" }, "12")),
                    React.createElement("select", { ref: "d_idx", className: this.props.inputClassName, value: MM_D, onChange: this.changeDay, disabled: MM == null, required: this.props.required }, _leap_day.map((item, i) => {
                        return React.createElement("option", { key: item, value: item }, item);
                    }))));
        }
        return out_html;
    }
}
CSelectDate.defaultProps = {
    disabled: false,
    inputViewMode: 1,
    required: false,
    min_year: Moment().year() - 15,
    max_year: Moment().year() + 10,
    value: null
};
exports.CSelectDate = CSelectDate;
