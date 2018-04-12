"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const ajax_1 = require("../../comm/ajax");
const comm_func_1 = require("../../comm/comm-func");
const api_1 = require("../../comm/api");
const update = require("react-addons-update");
let week_name = ['日', '一', '二', '三', '四', '五', '六'];
let area_sn_name = {
    'N': '北區',
    'S': '南區'
};
let mm_options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yy_play = jsinit.play_name.filter(x => x.yy == jsinit.yy);
const f_playname = yy_play.length > 0 ? yy_play[0].playname_id : jsinit.play_name[0].playname_id;
const def_divide_id = jsinit.divide[0].items[0].play_divide_id;
class StatsTeam extends React.Component {
    constructor() {
        super();
        this.chgQuery = this.chgQuery.bind(this);
        this.ajaxQuery = this.ajaxQuery.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.showTotal = this.showTotal.bind(this);
        this.showAverage = this.showAverage.bind(this);
        this.state = {
            static_data: [],
            show_type: 'total',
            query: {
                playname_id: f_playname,
                area_sn: jsinit.divide[0].area_sn,
                divide_id: def_divide_id
            }
        };
    }
    componentWillMount() {
        this.ajaxQuery();
    }
    ajaxQuery() {
        let params = this.state.query;
        ajax_1.ft(api_1.default.GET__api_Utility_GetStatsTeam, params)
            .then((res) => {
            this.setState({ static_data: res });
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
        let new_state = update(this.state.query, {
            [name]: { $set: value }
        });
        this.setState({
            query: new_state
        });
    }
    showTotal(e) {
        this.setState({ show_type: 'total' });
    }
    showAverage(e) {
        this.setState({ show_type: 'average' });
    }
    render() {
        let { static_data } = this.state;
        let query = this.state.query;
        let divide_item = jsinit.divide.find(x => x.area_sn == query.area_sn);
        return React.createElement("div", null,
            React.createElement("form", { className: "wrap field mb-48" },
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.playname_id, onChange: this.chgQuery.bind(this, 'playname_id') }, jsinit.play_name.map((item, i) => {
                    return React.createElement("option", { key: item.playname_id, value: item.playname_id }, item.play_name);
                })),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.area_sn, onChange: this.chgQuery.bind(this, 'area_sn') }, jsinit.divide.map((item, i) => {
                    return React.createElement("option", { key: 'area_sn-' + i, value: item.area_sn }, area_sn_name[item.area_sn]);
                })),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.divide_id, onChange: this.chgQuery.bind(this, 'divide_id') }, divide_item ?
                    divide_item.items.map((item, i) => {
                        return React.createElement("option", { key: 'divide_id-' + i, value: item.play_divide_id }, item.divide_name);
                    }) : null),
                React.createElement("button", { type: "button", className: "btn warning", onClick: this.ajaxQuery }, "\u641C\u5C0B")),
            React.createElement("section", { className: "wrap" },
                React.createElement("header", { className: "clearfix" },
                    React.createElement("h3", { className: "mt-0 pull-left text-left" },
                        "2017 \u5B63\u8CFD ",
                        React.createElement("small", null, "[\u5168\u5340] [\u5168\u90E8\u5206\u7D44]")),
                    React.createElement("nav", { className: "pull-right btn-group" },
                        React.createElement("button", { type: "button", className: 'btn-toggle' + (this.state.show_type == 'total' ? ' active' : ''), onClick: this.showTotal }, "\u7E3D\u548C"),
                        React.createElement("button", { type: "button", className: 'btn-toggle' + (this.state.show_type == 'average' ? ' active' : ''), onClick: this.showAverage }, "\u5E73\u5747"))),
                React.createElement("div", { className: "table-rwd" },
                    React.createElement("table", { className: "table-line table-hover" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", { rowSpan: 2, className: "item-ranking" }, "\u6392\u540D"),
                                React.createElement("th", { rowSpan: 2, className: "item-team" }, "\u7403\u968A"),
                                React.createElement("th", { rowSpan: 2 }, "\u51FA\u5834"),
                                React.createElement("th", { rowSpan: 2 }, "\u52DD"),
                                React.createElement("th", { rowSpan: 2 }, "\u8CA0"),
                                React.createElement("th", { colSpan: 4 }, "\u4E8C\u5206\u7403"),
                                React.createElement("th", { colSpan: 4 }, "\u4E09\u5206\u7403"),
                                React.createElement("th", { colSpan: 4 }, "\u7F70\u7403"),
                                React.createElement("th", { colSpan: 3 }, "\u7C43\u677F"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u52A9\u653B"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u6284\u622A"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u963B\u653B"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u5931\u8AA4"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u72AF\u898F"),
                                React.createElement("th", { rowSpan: 2, className: "text-right" }, "\u5F97\u5206")),
                            React.createElement("tr", null,
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u9032\u7403"),
                                React.createElement("th", { className: "text-nowarp" }, "-"),
                                React.createElement("th", { className: "text-left text-nowarp" }, "\u51FA\u624B"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "(\u547D\u4E2D\u7387)"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u9032\u7403"),
                                React.createElement("th", { className: "text-nowarp" }, "-"),
                                React.createElement("th", { className: "text-left text-nowarp" }, "\u51FA\u624B"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "(\u547D\u4E2D\u7387)"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u9032\u7403"),
                                React.createElement("th", { className: "text-nowarp" }, "-"),
                                React.createElement("th", { className: "text-left text-nowarp" }, "\u51FA\u624B"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "(\u547D\u4E2D\u7387)"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u9032\u653B"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u9632\u5B88"),
                                React.createElement("th", { className: "text-right text-nowarp" }, "\u7E3D\u8A08"))),
                        React.createElement("tbody", null, this.state.show_type == 'total' ?
                            static_data.map((item, i) => {
                                let rate_b2 = comm_func_1.stdNumber(item.Y2 * 100 / (item.Y2 + item.N2), 2);
                                let rate_b3 = comm_func_1.stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                                let rate_bp = comm_func_1.stdNumber(item.YP * 100 / (item.YP + item.NP), 2);
                                return React.createElement("tr", null,
                                    React.createElement("td", null, i + 1),
                                    React.createElement("td", { className: "item-team" },
                                        React.createElement("a", { href: gb_approot + 'Team/Info?team_id=' + item.team_id, className: "hover-danger" }, item.team_name)),
                                    React.createElement("td", { className: "text-right" }, item.num),
                                    React.createElement("td", { className: "text-right" }, item.win),
                                    React.createElement("td", { className: "text-right" }, item.lost),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.Y2),
                                    React.createElement("td", { className: "text-nowarp" }, "-"),
                                    React.createElement("td", { className: "text-left text-nowarp" }, item.Y2 + item.N2),
                                    React.createElement("td", { className: "text-right text-nowarp" },
                                        "(",
                                        rate_b2,
                                        "%)"),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.Y3),
                                    React.createElement("td", { className: "text-nowarp" }, "-"),
                                    React.createElement("td", { className: "text-left text-nowarp" }, item.Y3 + item.N3),
                                    React.createElement("td", { className: "text-right text-nowarp" },
                                        "(",
                                        rate_b3,
                                        "%)"),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.YP),
                                    React.createElement("td", { className: "text-nowarp" }, "-"),
                                    React.createElement("td", { className: "text-left text-nowarp" }, item.YP + item.NP),
                                    React.createElement("td", { className: "text-right text-nowarp" },
                                        "(",
                                        rate_bp,
                                        "%)"),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.ARebounds),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.DRebounds),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.ARebounds + item.DRebounds),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.ast),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.stl),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.blk),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.turnovers),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.foul),
                                    React.createElement("td", { className: "text-right text-nowarp" }, item.Score));
                            })
                            :
                                static_data.map((item, i) => {
                                    let rate_b2 = comm_func_1.stdNumber(item.Y2 * 100 / (item.Y2 + item.N2), 2);
                                    let rate_b3 = comm_func_1.stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                                    let rate_bp = comm_func_1.stdNumber(item.YP * 100 / (item.YP + item.NP), 2);
                                    return React.createElement("tr", null,
                                        React.createElement("td", null, i + 1),
                                        React.createElement("td", { className: "item-team" },
                                            React.createElement("a", { href: gb_approot + 'Team/Info?team_id=' + item.team_id, className: "hover-danger" }, item.team_name)),
                                        React.createElement("td", { className: "text-right" }, item.num),
                                        React.createElement("td", { className: "text-right" }, item.win),
                                        React.createElement("td", { className: "text-right" }, item.lost),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.Y2 / item.num, 2)),
                                        React.createElement("td", { className: "text-nowarp" }, "-"),
                                        React.createElement("td", { className: "text-left text-nowarp" }, comm_func_1.stdNumber((item.Y2 + item.N2) / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" },
                                            "(",
                                            rate_b2,
                                            "%)"),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.Y3 / item.num, 2)),
                                        React.createElement("td", { className: "text-nowarp" }, "-"),
                                        React.createElement("td", { className: "text-left text-nowarp" }, comm_func_1.stdNumber((item.Y3 + item.N3) / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" },
                                            "(",
                                            rate_b3,
                                            "%)"),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.YP / item.num, 2)),
                                        React.createElement("td", { className: "text-nowarp" }, "-"),
                                        React.createElement("td", { className: "text-left text-nowarp" }, comm_func_1.stdNumber((item.YP + item.NP) / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" },
                                            "(",
                                            rate_bp,
                                            "%)"),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumberFloat(item.ARebounds / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.DRebounds / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber((item.ARebounds + item.DRebounds) / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.ast / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.stl / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.blk / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.turnovers / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.foul / item.num, 2)),
                                        React.createElement("td", { className: "text-right text-nowarp" }, comm_func_1.stdNumber(item.Score / item.num, 2)));
                                }))))));
    }
}
var dom = document.getElementById('reactroot');
react_dom_1.render(React.createElement(StatsTeam, null), dom);
