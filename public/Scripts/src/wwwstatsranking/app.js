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
class StatsRanking extends React.Component {
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
                playname_id: null,
                area_sn: 'N',
                divide_id: null
            }
        };
    }
    componentWillMount() {
        this.ajaxQuery();
    }
    ajaxQuery() {
        let params = this.state.query;
        ajax_1.ft(api_1.default.GET__api_Utility_GetStatsRanking, params)
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
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.area_sn, onChange: this.chgQuery.bind(this, 'area_sn'), defaultValue: 'N' }, jsinit.divide.map((item, i) => {
                    return React.createElement("option", { key: 'area_sn-' + i, value: item.area_sn }, area_sn_name[item.area_sn]);
                })),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.divide_id, onChange: this.chgQuery.bind(this, 'divide_id') }, divide_item ?
                    divide_item.items.map((item, i) => {
                        return React.createElement("option", { key: 'divide_id-' + i, value: item.play_divide_id }, item.divide_name);
                    }) : null),
                React.createElement("select", { className: "form-element w-15 mr-12", value: query.orderby, defaultValue: 'score', onChange: this.chgQuery.bind(this, 'orderby') },
                    React.createElement("option", { value: 'rate_all' }, "\u6295\u7C43\u547D\u4E2D\u7387"),
                    React.createElement("option", { value: 'rate_3' }, "\u4E09\u5206\u7403\u547D\u4E2D\u7387"),
                    React.createElement("option", { value: 'score' }, "\u5F97\u5206"),
                    React.createElement("option", { value: 'rebounds' }, "\u7C43\u677F"),
                    React.createElement("option", { value: 'ast' }, "\u52A9\u653B"),
                    React.createElement("option", { value: 'stl' }, "\u6284\u622A"),
                    React.createElement("option", { value: 'blk' }, "\u963B\u653B")),
                React.createElement("button", { type: "button", className: "btn warning", onClick: this.ajaxQuery }, "\u641C\u5C0B")),
            React.createElement("section", { className: "wrap" },
                React.createElement("header", { className: "clearfix" },
                    React.createElement("h3", { className: "mt-0 pull-left text-left" },
                        "2017 \u5B63\u8CFD ",
                        React.createElement("small", null, "[\u5168\u5340] [\u5168\u90E8\u5206\u7D44]"))),
                React.createElement("div", { className: "table-rwd" },
                    React.createElement("table", { className: "table-line table-hover" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", { className: "item-ranking" }, "\u6392\u540D"),
                                React.createElement("th", { className: "text-left" }, "\u7403\u54E1"),
                                React.createElement("th", { className: "text-left" }, "\u7403\u968A"),
                                React.createElement("th", null, "\u51FA\u5834\u6B21\u6578"),
                                React.createElement("th", { className: "text-right" }, "\u6295\u7C43%"),
                                React.createElement("th", { className: "text-right" }, "\u4E09\u5206%"),
                                React.createElement("th", { className: "text-right" }, "\u7C43\u677F"),
                                React.createElement("th", { className: "text-right" }, "\u52A9\u653B"),
                                React.createElement("th", { className: "text-right" }, "\u6284\u622A"),
                                React.createElement("th", { className: "text-right" }, "\u963B\u653B"),
                                React.createElement("th", { className: "text-right" }, "\u5F97\u5206"))),
                        React.createElement("tbody", null, static_data.map((item, i) => {
                            let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : comm_func_1.stdNumber(item.Y2 / (item.Y2 + item.N2), 2);
                            let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : comm_func_1.stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                            let rate_bp = item.YP + item.NP === 0 ? 0 : comm_func_1.stdNumber(item.YP / (item.YP + item.NP), 2);
                            let rate_all = (item.Y2 + item.N2 + item.Y3 + item.N3 + item.YP + item.NP) === 0 ?
                                0 : (item.Y2 + item.Y3 + item.N3 + item.YP) * 100 / (item.Y2 + item.N2 + item.Y3 + item.N3 + item.YP + item.NP);
                            return React.createElement("tr", null,
                                React.createElement("td", null, i + 1),
                                React.createElement("td", { className: "text-left" }, item.player_name),
                                React.createElement("td", { className: "item-team" }, item.team_name),
                                React.createElement("td", null, item.num),
                                React.createElement("td", { className: "text-right" }, comm_func_1.stdNumber(rate_all, 2)),
                                React.createElement("td", { className: "text-right" }, rate_b3),
                                React.createElement("td", { className: "text-right" }, item.ARebounds + item.DRebounds),
                                React.createElement("td", { className: "text-right" }, item.ast),
                                React.createElement("td", { className: "text-right" }, item.stl),
                                React.createElement("td", { className: "text-right" }, item.blk),
                                React.createElement("td", { className: "text-right" }, item.Score));
                        }))))));
    }
}
var dom = document.getElementById('reactroot');
react_dom_1.render(React.createElement(StatsRanking, null), dom);
