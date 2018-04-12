/* 承心 2017-03-15
** 編輯檢視日期共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import { config } from './defData'
import ReactSuperSelect = require('react-super-select');
import 'react-super-select/lib/react-super-select.css';

interface ReactAutoSelectProps {
    inputViewMode?: InputViewMode
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    options?: Array<AutoSelectOptions>;
    id?: string;
    required?: boolean;
    is_blank?: boolean;
    placeholder?: string;
    show_type?: SelectShowType;
    group?: string,
    is_int_type?: boolean;

    ajaxDataFetch?: Function;
}
interface AutoSelectTextState {
}
export class ReactAutoSelectText extends React.Component<ReactAutoSelectProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        placeholder: "請選擇",
        disabled: false,
        inputViewMode: InputViewMode.edit,
        required: false,
        is_blank: false,
        blank_text: lang.option_blank,
        show_type: SelectShowType.label,
        is_int_type: false,
        options: []
    }

    onChange(option: AutoSelectOptions, e) {
        let value = option ? option.id : undefined;

        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(option.id), e);
        } else {
            this.props.onChange(value, e);
        }

    }
    render() {
        let out_html = null;
        let pp = this.props;
        //let value = this.props.value == undefined ? '' : this.props.value.toString();
        var init_options = pp.options.filter(x => x.id == pp.value) ? pp.options.filter(x => x.id == pp.value) : [];

        if (this.props.inputViewMode == InputViewMode.edit && pp.options.length > 0 ) {
            if (init_options.length > 0) {
                out_html =
                    (
                        <ReactSuperSelect
                        placeholder={pp.placeholder}
                        clearSearchOnSelection={true}
                        clearable={false}
                        deselectOnSelectedOptionClick={false}
                        searchable={true}
                        dataSource={pp.options}
                        initialValue={init_options}
                        onChange={this.onChange}
                        ajaxDataFetch={pp.ajaxDataFetch}
                    />
                    );
            } else {
                out_html =
                    (
                        <ReactSuperSelect
                            placeholder={pp.placeholder}
                            clearSearchOnSelection={true}
                            clearable={false}
                            deselectOnSelectedOptionClick={false}
                            searchable={true}
                            dataSource={pp.options}
                            onChange={this.onChange}
                            ajaxDataFetch={pp.ajaxDataFetch}
                    />
                    );
            }
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html = <span className={this.props.viewClassName} id={this.props.id}></span>; //無

            this.props.options.forEach((item, i) => {
                if (item.id == this.props.value) {
                    if (this.props.show_type == SelectShowType.label)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.name}</span>

                    if (this.props.show_type == SelectShowType.value)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.id}</span>
                }
            })
        }
        return out_html;
    }
}
