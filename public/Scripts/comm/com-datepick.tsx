/* 承心 2017-08-05
** 編輯檢視日期共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import moment = require('moment');
import DatePicker from 'react-datepicker';
import { config } from './defData';
import '../../Content/css/vendor/react-datepicker.css';
//console.log(DatePicker);
interface DatePickTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string;
    required?: boolean;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
}
interface DatePickTextState {
}
export class DatePickText extends React.Component<DatePickTextProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        required: false,
        inputViewMode: InputViewMode.edit
    }
    onChange(date: moment.Moment) {

        let value = date == null ? null : date.format();
        this.props.onChange(value, this);
    }
    render() {
        let out_html = <div>Test</div>;
        let pp = this.props;
        let value: moment.Moment = pp.value == undefined ? null : moment(pp.value);
        //console.log('Check DatePickText value', pp.value, value);

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <div style={{ display: 'inline-block' }}>
                        <DatePicker
                            selected={value}
                            dateFormat={config.dateFT}
                            isClearable={true}
                            required={pp.required}
                            locale="zh-TW"
                            showYearDropdown
                            onChange={this.onChange}
                            disabled={pp.disabled}
                            minDate={pp.minDate}
                            maxDate={pp.maxDate}
                            className={pp.inputClassName}
                        />
                    </div>
                );
        }

        //if (this.props.inputViewMode == InputViewMode.view) {
        //    out_html =
        //        (
        //            <span
        //                className={this.props.viewClassName}>
        //                {value.format(config.dateFT)}
        //            </span>
        //        );
        //}
        return out_html;
    }
}