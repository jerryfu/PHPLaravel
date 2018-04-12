"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const components_1 = require("../../comm/components");
const func_1 = require("./func");
const comm_typeahead_1 = require("../../comm/comm-typeahead");
const update = require("react-addons-update");
class TableRecord extends React.Component {
    constructor() {
        super();
        this.chgTypeAhead = this.chgTypeAhead.bind(this);
        this.state = {
            getPlayer: {
                player_id: null,
                player_name: null
            }
        };
    }
    chgTypeAhead(id, text, data) {
        let { records } = this.props;
        if (confirm('確定是否增加球員[' + text + ']')) {
            let struct = {
                getPlayer: {
                    player_id: { $set: id },
                    player_name: { $set: data.player_name },
                }
            };
            var n_state = update(this.state, struct);
            this.setState(n_state);
            this.props.addPlayerToSchedule(id, data.player_name, data.jersey_number, data.team_name);
        }
        else {
            let struct = {
                getPlayer: {
                    player_id: { $set: null },
                    player_name: { $set: null }
                }
            };
            var n_state = update(this.state, struct);
            this.setState(n_state);
        }
    }
    render() {
        let pp = this.props;
        let sum_Y3 = 0;
        let activeItem = pp.records.data.filter(x => x.active == true);
        let sortItem = pp.records.data.slice();
        sortItem.sort((x, y) => {
            return (x === y) ? 0 : x.active ? -1 : 1;
        });
        return React.createElement("table", { className: "table-list table-hover table-striped" },
            React.createElement("caption", null,
                pp.records.team_name,
                "(",
                activeItem.sum(x => { return func_1.sumSource(x.Y3, x.Y2, x.YP); }),
                ")",
                React.createElement(comm_typeahead_1.default, { apiPath: gb_approot + 'api/Player/Query', onCompleteChange: this.chgTypeAhead, value: this.state.getPlayer.player_name, dataTextFunc: (data) => {
                        return data.player_name + '[' + data.idno + '][' + data.team_name + '][' + data.jersey_number + ']';
                    } })),
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { className: "item-edit bg-dark", rowSpan: 2 }, "\u53C3\u8207"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u80CC\u865F"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u59D3\u540D"),
                    React.createElement("th", { className: "bg-dark", colSpan: 2 }, "3\u5206\u6295\u7C43"),
                    React.createElement("th", { className: "bg-dark", colSpan: 2 }, "2\u5206\u6295\u7C43"),
                    React.createElement("th", { className: "bg-dark", colSpan: 2 }, "\u7F70\u7403"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u5F97\u5206"),
                    React.createElement("th", { className: "bg-dark", colSpan: 2 }, "\u7C43\u677F\u7403"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u52A9\u653B"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u6284\u622A"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u963B\u653B"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u5931\u8AA4"),
                    React.createElement("th", { className: "bg-dark", rowSpan: 2 }, "\u72AF\u898F")),
                React.createElement("tr", null,
                    React.createElement("th", { className: "bg-dark" }, "\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u4E0D\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u4E0D\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u4E0D\u4E2D\u7C43"),
                    React.createElement("th", { className: "bg-dark" }, "\u9032 \u653B"),
                    React.createElement("th", { className: "bg-dark" }, "\u9632\u5B88"))),
            React.createElement("tbody", null, sortItem.map((item, i) => {
                sum_Y3 += func_1.sumCdn(item.Y3, item.active);
                return React.createElement("tr", { key: 'player_' + item.player_id },
                    React.createElement("td", null,
                        React.createElement("label", { htmlFor: 'active_' + item.player_id, className: "switch" },
                            React.createElement(components_1.CheckText, { id: 'active_' + item.player_id, onClick: pp.chgFldVal.bind(this, item.player_id, 'active'), inputViewMode: 1, checked: item.active, value: item.player_id }),
                            React.createElement("div", { className: "slider round" }))),
                    React.createElement("td", null,
                        React.createElement(components_1.InputText, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'jersey_number'), value: item.jersey_number, required: true })),
                    React.createElement("td", { className: "word-keep" },
                        React.createElement(components_1.InputText, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'player_name'), value: item.player_name, required: true })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'Y3'), value: item.Y3, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'N3'), value: item.N3, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'Y2'), value: item.Y2, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'N2'), value: item.N2, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'YP'), value: item.YP, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'NP'), value: item.NP, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null, func_1.fmtSource(item.Y3, item.Y2, item.YP)),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'ARebounds'), value: item.ARebounds, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'DRebounds'), value: item.DRebounds, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'ast'), value: item.ast, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'stl'), value: item.stl, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'blk'), value: item.blk, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'turnovers'), value: item.turnovers, required: false, onlyPositive: true, disabled: !item.active })),
                    React.createElement("td", null,
                        React.createElement(components_1.InputNum, { inputClassName: "text-center", onChange: pp.chgFldVal.bind(this, item.player_id, 'foul'), value: item.foul, required: false, onlyPositive: true, disabled: !item.active })));
            })),
            React.createElement("tfoot", { className: "sum" },
                React.createElement("tr", null,
                    React.createElement("td", { colSpan: 3 }, "\u7E3D\u8A08"),
                    React.createElement("td", null, sum_Y3),
                    React.createElement("td", null, activeItem.sum(x => x.N3)),
                    React.createElement("td", null, activeItem.sum(x => x.Y2)),
                    React.createElement("td", null, activeItem.sum(x => x.N2)),
                    React.createElement("td", null, activeItem.sum(x => x.YP)),
                    React.createElement("td", null, activeItem.sum(x => x.NP)),
                    React.createElement("td", null, activeItem.sum(x => { return func_1.sumSource(x.Y3, x.Y2, x.YP); })),
                    React.createElement("td", null, activeItem.sum(x => x.ARebounds)),
                    React.createElement("td", null, activeItem.sum(x => x.DRebounds)),
                    React.createElement("td", null, activeItem.sum(x => x.ast)),
                    React.createElement("td", null, activeItem.sum(x => x.stl)),
                    React.createElement("td", null, activeItem.sum(x => x.blk)),
                    React.createElement("td", null, activeItem.sum(x => x.turnovers)),
                    React.createElement("td", null, activeItem.sum(x => x.foul)))));
    }
}
exports.default = TableRecord;
