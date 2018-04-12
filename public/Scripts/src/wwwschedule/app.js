"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const ajax_1 = require("../../comm/ajax");
const api_1 = require("../../comm/api");
const moment = require("moment");
const update = require("react-addons-update");
let week_name = ['日', '一', '二', '三', '四', '五', '六'];
let area_sn_name = {
    'N': '北區',
    'S': '南區'
};
let mm_options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
class Schedule extends React.Component {
    constructor() {
        super();
        this.chgQuery = this.chgQuery.bind(this);
        this.ajaxQuery = this.ajaxQuery.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.state = {
            schedule_data: [],
            schedule_query: {
                mm: (moment().month() + 1),
                area_sn: null,
                divide_id: null
            }
        };
    }
    componentWillMount() {
        this.ajaxQuery();
    }
    ajaxQuery() {
        let params = this.state.schedule_query;
        ajax_1.ft(api_1.default.GET__api_Utility_GetSchudel, params)
            .then((res) => {
            this.setState({ schedule_data: res });
        });
    }
    submitQuery(e) {
        e.preventDefault();
        this.ajaxQuery();
        return;
    }
    chgQuery(name, e) {
        let input = e.target;
        let value = input.value;
        let new_state = update(this.state.schedule_query, {
            [name]: { $set: value }
        });
        this.setState({
            schedule_query: new_state
        });
    }
    render() {
        let { schedule_data } = this.state;
        let query = this.state.schedule_query;
        let divide_item = jsinit.divide.find(x => x.area_sn == query.area_sn);
        return React.createElement("div", null,
            React.createElement("h1", { className: "mb-24" },
                jsinit.yy,
                " \u5B63\u8CFD \u8CFD\u7A0B\u8868"),
            React.createElement("form", { className: "wrap field mb-48", onSubmit: this.submitQuery },
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.mm, onChange: this.chgQuery.bind(this, 'mm') },
                    React.createElement("option", { value: "" }, "\u5168\u5E74"),
                    mm_options.map(x => {
                        return React.createElement("option", { key: 'mm-' + x, value: x },
                            x,
                            "\u6708");
                    })),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.area_sn, onChange: this.chgQuery.bind(this, 'area_sn') },
                    React.createElement("option", { value: "" }, "\u5168\u5340"),
                    jsinit.divide.map((item, i) => {
                        return React.createElement("option", { key: 'area_sn-' + i, value: item.area_sn }, area_sn_name[item.area_sn]);
                    })),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.divide_id, onChange: this.chgQuery.bind(this, 'divide_id') },
                    React.createElement("option", { value: "" }, "\u5168\u90E8\u5206\u7D44"),
                    divide_item ?
                        divide_item.items.map((item, i) => {
                            return React.createElement("option", { key: 'divide_id-' + i, value: item.play_divide_id }, item.divide_name);
                        }) : null),
                React.createElement("button", { type: "submit", className: "btn warning" }, "\u641C\u5C0B")),
            schedule_data.map((item, i) => {
                return React.createElement("section", { key: 'schedule-' + i, className: "wrap" },
                    React.createElement("div", { className: "table-rwd" },
                        React.createElement("table", { className: "table-line table-hover sortable" },
                            React.createElement("caption", { className: "text-left" },
                                item.mm,
                                "\u6708 ",
                                area_sn_name[item.area_sn]),
                            React.createElement("colgroup", null,
                                React.createElement("col", { style: { width: '10%' } }),
                                React.createElement("col", { span: 3 }),
                                React.createElement("col", { style: { width: '25%' } }),
                                React.createElement("col", { style: { width: '4%' } }),
                                React.createElement("col", { style: { width: '25%' } }),
                                React.createElement("col", { style: { width: '12%' } }),
                                React.createElement("col", { style: { width: '15%' } })),
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, "\u65E5\u671F"),
                                    React.createElement("th", null, "#"),
                                    React.createElement("th", null, "\u6642\u9593"),
                                    React.createElement("th", null, "\u5206\u7D44"),
                                    React.createElement("th", { className: "text-right" }, "\u4E3B\u968A"),
                                    React.createElement("th", { className: "sorttable_nosort" }),
                                    React.createElement("th", { className: "text-left" }, "\u5BA2\u968A"),
                                    React.createElement("th", null, "\u6BD4\u5206"),
                                    React.createElement("th", null, "\u5730\u9EDE"))),
                            item.items.map((sub, j) => {
                                let set_data = moment(sub.set_date);
                                return React.createElement("tbody", { key: 'schedule-' + i + '_sub-' + j },
                                    React.createElement("tr", null,
                                        React.createElement("td", null,
                                            React.createElement("strong", null, set_data.date()),
                                            "(",
                                            week_name[set_data.weekday()],
                                            ")"),
                                        React.createElement("td", null, sub.sno),
                                        React.createElement("td", null, set_data.format('HH:mm')),
                                        React.createElement("td", null, sub.divide_name),
                                        React.createElement("td", { className: "text-right" },
                                            sub.home_score > sub.visiting_score ?
                                                React.createElement("span", { className: "label label-success circle" }, "\u52DD") : React.createElement("span", null),
                                            ' ',
                                            sub.home_team_name),
                                        React.createElement("td", null, "vs"),
                                        React.createElement("td", { className: "text-left" },
                                            sub.visiting_team_name,
                                            ' ',
                                            sub.visiting_score > sub.home_score ?
                                                React.createElement("span", { className: "label label-success circle" }, "\u52DD") : React.createElement("span", null)),
                                        React.createElement("td", null, (sub.home_score != null && sub.visiting_score != null) ?
                                            React.createElement("a", { href: gb_approot + 'Schedule/Result?id=' + sub.schedule_id, className: "hover-danger" },
                                                sub.home_score,
                                                " - ",
                                                sub.visiting_score) : React.createElement("span", null, "-")),
                                        React.createElement("td", null,
                                            React.createElement("a", { href: "https://www.google.com.tw/maps?q=" + sub.address, target: "_blank" }, sub.site_name))));
                            }))));
            }));
    }
}
var dom = document.getElementById('reactroot');
react_dom_1.render(React.createElement(Schedule, null), dom);
