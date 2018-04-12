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
class StatsPlayer extends React.Component {
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
                divide_id: null
            }
        };
    }
    componentWillMount() {
        this.ajaxQuery();
    }
    ajaxQuery() {
        let params = { id: player_id };
        ajax_1.ft(api_1.default.GET__api_Utility_GetPlayerData, params)
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
        return React.createElement("section", { className: "wrap" },
            React.createElement("header", { className: "clearfix" },
                React.createElement("h3", { className: "mt-0 pull-left text-left" }, "\u55AE\u5B63\u6578\u64DA"),
                React.createElement("nav", { className: "pull-right btn-group" },
                    React.createElement("button", { type: "button", className: 'btn-toggle' + (this.state.show_type == 'total' ? ' active' : ''), onClick: this.showTotal }, "\u7E3D\u548C"),
                    React.createElement("button", { type: "button", className: 'btn-toggle' + (this.state.show_type == 'average' ? ' active' : ''), onClick: this.showAverage }, "\u5E73\u5747"))),
            React.createElement("table", { className: "table-line table-hover" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { rowSpan: 2 }, "\u80CC\u865F"),
                        React.createElement("th", { rowSpan: 2 }, "\u51FA\u5834\u6B21\u6578"),
                        React.createElement("th", { colSpan: 4, style: { "width": "12.8%" } }, "\u4E8C\u5206\u7403"),
                        React.createElement("th", { colSpan: 4, style: { "width": "12.8%" } }, "\u4E09\u5206\u7403"),
                        React.createElement("th", { colSpan: 4, style: { "width": "12.8%" } }, "\u7F70\u7403"),
                        React.createElement("th", { colSpan: 3, style: { "width": "12.2%" } }, "\u7C43\u677F"),
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
                        let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : comm_func_1.stdNumber(item.Y2 * 100 / (item.Y2 + item.N2), 2);
                        let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : comm_func_1.stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                        let rate_bp = item.YP + item.NP === 0 ? 0 : comm_func_1.stdNumber(item.YP * 100 / (item.YP + item.NP), 2);
                        return React.createElement("tr", { key: 'total-' + item.player_id },
                            React.createElement("td", null, item.jersey_number),
                            React.createElement("td", null, item.num),
                            React.createElement("td", { className: "text-right" }, item.Y2 ? item.Y2 : 0),
                            React.createElement("td", null, "-"),
                            React.createElement("td", { className: "text-left" }, item.Y2 + item.N2),
                            React.createElement("td", { className: "text-right" },
                                "(",
                                rate_b2 ? rate_b2 : 0,
                                "%)"),
                            React.createElement("td", { className: "text-right" }, item.Y3 ? item.Y3 : 0),
                            React.createElement("td", null, "-"),
                            React.createElement("td", { className: "text-left" }, item.Y3 + item.N3),
                            React.createElement("td", { className: "text-right" },
                                "(",
                                rate_b3 ? rate_b3 : 0,
                                "%)"),
                            React.createElement("td", { className: "text-right" }, item.YP ? item.YP : 0),
                            React.createElement("td", null, "-"),
                            React.createElement("td", { className: "text-left" }, item.YP + item.NP),
                            React.createElement("td", { className: "text-right" },
                                "(",
                                rate_bp ? rate_bp : 0,
                                "%)"),
                            React.createElement("td", { className: "text-right" }, item.ARebounds),
                            React.createElement("td", { className: "text-right" }, item.DRebounds),
                            React.createElement("td", { className: "text-right" }, item.ARebounds + item.DRebounds),
                            React.createElement("td", { className: "text-right" }, item.ast),
                            React.createElement("td", { className: "text-right" }, item.stl),
                            React.createElement("td", { className: "text-right" }, item.blk),
                            React.createElement("td", { className: "text-right" }, item.turnovers),
                            React.createElement("td", { className: "text-right" }, item.foul),
                            React.createElement("td", { className: "text-right" }, item.Score));
                    })
                    :
                        static_data.map((item, i) => {
                            let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : comm_func_1.stdNumber(item.Y2 / (item.Y2 + item.N2), 2);
                            let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : comm_func_1.stdNumber(item.Y3 / (item.Y3 + item.N3), 2);
                            let rate_bp = item.YP + item.NP === 0 ? 0 : comm_func_1.stdNumber(item.YP / (item.YP + item.NP), 2);
                            return React.createElement("tr", { key: 'average-' + item.player_id },
                                React.createElement("td", null, item.jersey_number),
                                React.createElement("td", null, item.num),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.Y2 / item.num, 2)),
                                React.createElement("td", null, "-"),
                                React.createElement("td", { className: "text-left" }, comm_func_1.stdNumber((item.Y2 + item.N2) / item.num, 2)),
                                React.createElement("td", { className: "text-right" },
                                    "(",
                                    rate_b2,
                                    "%)"),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.Y3 / item.num, 2)),
                                React.createElement("td", null, "-"),
                                React.createElement("td", { className: "text-left" }, comm_func_1.stdNumber((item.Y3 + item.N3) / item.num, 2)),
                                React.createElement("td", { className: "text-right" },
                                    "(",
                                    rate_b3,
                                    "%)"),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.YP / item.num, 2)),
                                React.createElement("td", null, "-"),
                                React.createElement("td", { className: "text-left" }, comm_func_1.stdNumber((item.YP + item.NP) / item.num, 2)),
                                React.createElement("td", { className: "text-right" },
                                    "(",
                                    rate_bp,
                                    "%)"),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.ARebounds / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.DRebounds / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber((item.ARebounds + item.DRebounds) / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.ast / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.stl / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.blk / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.turnovers / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.foul / item.num, 2)),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(item.Score / item.num, 2)));
                        }))));
    }
}
var dom = document.getElementById('reactroot');
react_dom_1.render(React.createElement(StatsPlayer, null), dom);
