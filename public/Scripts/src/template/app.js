"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const comm_func_1 = require("../../comm/comm-func");
const ajax_1 = require("../../comm/ajax");
let fieldCollect = {
    data: [
        {
            field_name: 'title',
            length: 60,
            allow_null: false,
            types: 'string'
        }, {
            field_name: 'set_date',
            length: 20,
            allow_null: false,
            types: 'date'
        }
    ]
};
let optionType = [
    "label", "text", "select", "date", "email", "number", "radio", "checbox", "textarea", "file"
];
class TopNode extends React.Component {
    constructor() {
        super();
        this.clickDelCell = this.clickDelCell.bind(this);
        this.clickAddRow = this.clickAddRow.bind(this);
        this.clickAddRow = this.clickAddRow.bind(this);
        this.clickDelRow = this.clickDelRow.bind(this);
        this.onChangeInputCheck = this.onChangeInputCheck.bind(this);
        this.onChangeInputEdit = this.onChangeInputEdit.bind(this);
        this.clickAddGridField = this.clickAddGridField.bind(this);
        this.clickDelGridField = this.clickDelGridField.bind(this);
        this.onChangeInputGridName = this.onChangeInputGridName.bind(this);
        this.onChangeInputGridLink = this.onChangeInputGridLink.bind(this);
        this.onChangeInputGridSort = this.onChangeInputGridSort.bind(this);
        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.clickSave = this.clickSave.bind(this);
        this.onChangeTable = this.onChangeTable.bind(this);
        this.clickLoad = this.clickLoad.bind(this);
        this.setDefaultGrid = this.setDefaultGrid.bind(this);
        this.state = {
            dataMap: {
                table: null,
                data1: [],
                data2: []
            },
            tableFieldModal: [],
            jsxResult: ""
        };
    }
    clickAddGridField(e) {
        let state = this.state;
        state.dataMap.data2.push({
            id: comm_func_1.guid(),
            edit_name: null,
            show_name: null,
            sortable: false
        });
        this.setState(state);
    }
    clickDelGridField(i, e) {
        let state = this.state;
        state.dataMap.data2.splice(i, 1);
        this.setState(state);
    }
    onChangeInputGridName(i, e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.data2[i].show_name = input.value;
        this.setState(state);
    }
    onChangeInputGridLink(i, e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.data2[i].edit_name = input.value;
        this.setState(state);
    }
    onChangeInputGridSort(i, e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.data2[i].sortable = !state.dataMap.data2[i].sortable;
        this.setState(state);
    }
    clickDelCell(i, j, e) {
        let state = this.state;
        state.dataMap.data1[i].splice(j, 1);
        this.setState(state);
    }
    clickAddRow(e) {
        let state = this.state;
        state.dataMap.data1.push([]);
        this.setState(state);
    }
    clickAddField(i, e) {
        let state = this.state;
        state.dataMap.data1[i].push({
            id: comm_func_1.guid(),
            edit_name: null,
            types: 'text',
            max_length: 0,
            required: true,
            place_holder: '',
            cols: 5,
            withCols: 2,
            withLabel: ''
        });
        this.setState(state);
    }
    clickDelRow(i, e) {
        let state = this.state;
        state.dataMap.data1.splice(i, 1);
        this.setState(state);
    }
    onChangeInputCheck(i, j, name, e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.data1[i][j][name] = !state.dataMap.data1[i][j][name];
        this.setState(state);
    }
    onChangeInputEdit(i, j, name, e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.data1[i][j][name] = input.value;
        this.setState(state);
    }
    onChangeTable(e) {
        let input = e.target;
        let state = this.state;
        state.dataMap.table = input.value;
        this.setState(state);
    }
    clickLoad(e) {
        let table = this.state.dataMap.table;
        let _self = this;
        ajax_1.fetchGet('/Template/Load', { table_name: table }).then((data) => {
            _self.setState({
                tableFieldModal: data.field,
                dataMap: data.json
            });
        });
    }
    clickSave(e) {
        let postData = this.state.dataMap;
        ajax_1.fetchPost('/Template/Save', postData).then((data) => {
            this.setState({ jsxResult: data.jsxResult });
        });
    }
    setDefaultValue(i, j, e) {
        let input = e.target;
        let n = parseInt(input.value, 10);
        let field = this.state.tableFieldModal[n];
        let state = this.state;
        let item = state.dataMap.data1[i][j];
        item.edit_name = field.field_name;
        item.required = !field.allow_null;
        item.max_length = field.length;
        item.withLabel = field.field_name;
        this.setState(state);
    }
    setDefaultGrid(i, e) {
        let input = e.target;
        let n = parseInt(input.value, 10);
        let field = this.state.tableFieldModal[n];
        let state = this.state;
        let item = state.dataMap.data2[i];
        item.edit_name = field.field_name;
        this.setState(state);
    }
    render() {
        let warp = this.state.dataMap.data1;
        let gridFields = this.state.dataMap.data2 ? this.state.dataMap.data2 : [];
        return React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("label", null, "Table:"),
                React.createElement("input", { type: "text", value: this.state.dataMap.table, onChange: this.onChangeTable }),
                React.createElement("button", { type: "button", onClick: this.clickLoad }, "Load")),
            React.createElement("div", null,
                React.createElement("button", { type: "button", onClick: this.clickSave }, "Save")),
            React.createElement("button", { type: "button", onClick: this.clickAddGridField }, "Add Grid Field"),
            React.createElement("table", null,
                React.createElement("tr", null, gridFields.map((item, i) => {
                    return React.createElement("td", { id: item.id },
                        React.createElement("button", { type: "button", onClick: this.clickDelGridField.bind(this, i) }, "Del"),
                        React.createElement("div", null,
                            React.createElement("label", null, "\u540D\u7A31:"),
                            React.createElement("input", { type: "text", value: item.show_name, onChange: this.onChangeInputGridName.bind(this, i) })),
                        React.createElement("div", null,
                            React.createElement("label", null, "\u5C0D\u6620:"),
                            React.createElement(LinkFieldInput, { onChangeInputEditName: this.onChangeInputGridLink.bind(this, i), value: item.edit_name, tableFieldModal: this.state.tableFieldModal, setDefaultValue: this.setDefaultGrid.bind(this, i) })),
                        React.createElement("div", null,
                            React.createElement("label", null, "\u6392\u5E8F:"),
                            React.createElement("input", { type: "checkbox", value: "1", checked: item.sortable == true, onChange: this.onChangeInputGridSort.bind(this, i) })));
                }))),
            React.createElement("hr", null),
            React.createElement("button", { type: "button", onClick: this.clickAddRow }, "Add Row"),
            React.createElement("table", null, warp.map((warpCol, i) => {
                return React.createElement("tr", { key: i },
                    React.createElement("td", { style: { verticalAlign: "top" } },
                        React.createElement("button", { type: "button", onClick: this.clickDelRow.bind(this, i) }, "Del Row")),
                    React.createElement("td", { style: { verticalAlign: "top" } },
                        React.createElement("button", { type: "button", onClick: this.clickAddField.bind(this, i) }, "Add Field")),
                    warpCol.map((item, j) => {
                        return React.createElement("td", { key: item.id },
                            React.createElement(WarpFram, { warpContext: item, iIndex: i, jIndex: j, clickDelCell: this.clickDelCell, onChangeCheckType: this.onChangeInputCheck.bind(this, i, j), onChangeInputEditName: this.onChangeInputEdit.bind(this, i, j), setDefaultValue: this.setDefaultValue.bind(this, i, j), tableFieldModal: this.state.tableFieldModal }));
                    }));
            })),
            React.createElement("textarea", { value: this.state.jsxResult, rows: 400, cols: 180 }));
    }
}
class WarpFram extends React.Component {
    constructor() {
        super();
    }
    render() {
        let pp = this.props;
        return React.createElement("div", null,
            React.createElement("button", { type: "button", onClick: this.props.clickDelCell.bind(this, pp.iIndex, pp.jIndex) }, "Del"),
            React.createElement("br", null),
            "Link Field :",
            React.createElement(LinkFieldInput, { value: pp.warpContext.edit_name, onChangeInputEditName: pp.onChangeInputEditName.bind(this, "edit_name"), setDefaultValue: pp.setDefaultValue, tableFieldModal: pp.tableFieldModal }),
            React.createElement("br", null),
            "Type       :",
            React.createElement("select", { value: pp.warpContext.types, onChange: pp.onChangeInputEditName.bind(this, "types") }, optionType.map((option, k) => {
                return React.createElement("option", { key: option, value: option }, option);
            })),
            React.createElement("br", null),
            "WithLabel :",
            React.createElement("input", { type: "text", value: pp.warpContext.withLabel, onChange: pp.onChangeInputEditName.bind(this, "withLabel") }),
            React.createElement("br", null),
            "With Cols :",
            React.createElement("input", { type: "number", value: pp.warpContext.withCols, onChange: pp.onChangeInputEditName.bind(this, "withCols") }),
            React.createElement("br", null),
            "Max Length :",
            React.createElement("input", { type: "text", value: pp.warpContext.max_length, onChange: pp.onChangeInputEditName.bind(this, "max_length") }),
            React.createElement("br", null),
            "PlaceHolder:",
            React.createElement("input", { type: "text", value: pp.warpContext.place_holder, onChange: pp.onChangeInputEditName.bind(this, "place_holder") }),
            React.createElement("br", null),
            "Requirded  :",
            React.createElement("input", { type: "checkbox", value: "1", checked: pp.warpContext.required == true, onChange: pp.onChangeCheckType.bind(this, "required") }),
            React.createElement("br", null),
            "Cols       :",
            React.createElement("input", { type: "number", value: pp.warpContext.cols, onChange: pp.onChangeInputEditName.bind(this, "cols") }));
    }
}
class LinkFieldInput extends React.Component {
    constructor() {
        super();
    }
    render() {
        return React.createElement("span", null,
            React.createElement("input", { type: "text", value: this.props.value, onChange: this.props.onChangeInputEditName }),
            React.createElement("select", { onChange: this.props.setDefaultValue }, this.props.tableFieldModal.map((item, i) => {
                return React.createElement("option", { value: i }, item.field_name);
            })));
    }
}
var dom = document.getElementById('main');
react_dom_1.render(React.createElement(TopNode, null), dom);
