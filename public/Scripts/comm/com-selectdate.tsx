import React = require('react');
//import ReactDOM = require('react-dom');
//import Moment from 'moment';
//import moment = require('moment');
import Moment = require('moment');
import { pad } from '../comm/comm-func';
//import { ui_text, config, modal_css, pw_rule } from '../comm/defData';

interface CSelectDataProps {
    inputViewMode: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: Moment.Moment;
    required?: boolean;
    min_year?: number;
    max_year?: number;
}
interface CSelectDataState {

}
export class CSelectDate extends React.Component<CSelectDataProps, CSelectDataState>{

    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        required: false,
        min_year: Moment().year() - 15,
        max_year: Moment().year() + 10,
        value: null
    }
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
        }
    }

    refs: {
        [key: string]: (Element);
        y_idx: any;
        m_idx: any;
        d_idx: any;
    }
    componentDidUpdate(prevProps, prevState) {

        //SetSelectEdge(this.refs.y_idx);
        //SetSelectEdge(this.refs.m_idx);
        //SetSelectEdge(this.refs.d_idx);
    }
    changeYear(e: React.FormEvent<any>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;

        if (input.value != '') {
            let value = parseInt(input.value, 10);

            let MT: Moment.Moment;
            if (this.props.value == null) {
                let _test_days = value + '-01-01';
                MT = Moment(_test_days);
            } else {
                MT = this.props.value;
            }

            let _m = MT.month();
            let _d = MT.date();

            let _test_days = value + '-' + pad((_m + 1).toString(), 2, '0', 1) + '-01';
            let MM = Moment(_test_days);

            if (_d > MM.daysInMonth()) { //切換年或切換月會進行該月日期數量置換，因此會發生2016-02-31狀況，故需做最小值設定!
                _d = MM.daysInMonth();
            }

            let _str_date = value + '-' + pad((_m + 1).toString(), 2, '0', 1) + '-' + pad(_d.toString(), 2, '0', 1) + ' 00:00';;
            let _date = Moment(_str_date, 'YYYY-MM-DD');

            this.props.onChange(_date);

        } else {
            this.props.onChange(null);
        }
    }
    changeMonth(e: React.FormEvent<any>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = parseInt(input.value, 10);

        let MT: Moment.Moment = this.props.value;
        let _y = MT.year();
        let _d = MT.date();

        let _test_days = _y + '-' + pad(value.toString(), 2, '0', 1) + '-01';
        let MM = Moment(_test_days);

        if (_d > MM.daysInMonth()) { //切換年或切換月會進行該月日期數量置換，因此會發生2016-02-31狀況，故需做最小值設定!
            _d = MM.daysInMonth();
        }

        let _str_date = _y + '-' + pad(value.toString(), 2, '0', 1) + '-' + pad(_d.toString(), 2, '0', 1) + ' 00:00';

        let _date = Moment(_str_date, 'YYYY-MM-DD');
        this.props.onChange(_date);
    }
    changeDay(e: React.FormEvent<any>) {

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let MT: Moment.Moment = this.props.value;
        let _y = MT.year();
        let _m = MT.month();
        let _d = parseInt(input.value, 10);

        let _str_date = _y + '-' + pad((_m + 1).toString(), 2, '0', 1) + '-' + pad(_d.toString(), 2, '0', 1) + ' 00:00';

        let _date = Moment(_str_date);
        //let _sdate = _date.format('YYYY-MM-DD')
        //console.log('E', 'change day', _str_date, _date, _sdate);
        this.props.onChange(_date);
    }
    render() {
        let out_html = null;
        let MM = this.props.value;

        if (this.props.inputViewMode == InputViewMode.view) {
            if (MM == null) {
                //檢視模式下 日期欄無資料
                out_html = <span>{''} </span>;
            } else {

                //檢視模式下 日期欄有資料
                let MM_Y = MM.year();
                let MM_M = MM.month();
                let MM_D = MM.date();
                let CDateText = ""; //UITpl.CDateText(MM_Y, MM_M + 1, MM_D);

                out_html = <span>{CDateText} </span>;
            }
        }

        if (this.props.inputViewMode == InputViewMode.edit) {

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
                (<span>
                    <select
                        ref="y_idx"
                        className={this.props.inputClassName}
                        value={MM_Y}
                        onChange={this.changeYear}
                        disabled={this.props.disabled}
                        required={this.props.required}>
                        <option value=""></option>
                        {
                            _y.map((item, i) => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                     {}
                    <select
                        ref="m_idx"
                        className={this.props.inputClassName}
                        value={(parseInt(MM_M) + 1)}
                        onChange={this.changeMonth}
                        disabled={MM == null}
                        required={this.props.required}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                    {}
                    <select
                        ref="d_idx"
                        className={this.props.inputClassName}
                        value={MM_D}
                        onChange={this.changeDay}
                        disabled={MM == null}
                        required={this.props.required}>
                        {
                            _leap_day.map((item, i) => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                </span>);
        }


        return out_html;
    }
}