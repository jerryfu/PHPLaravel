/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import { render } from 'react-dom';
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { guid } from '../../comm/comm-func';
import { ft, fetchPost, fetchGet } from '../../comm/ajax';
import ap from '../../comm/api';

//for (var item in ap) {
//    console.log(item);
//}

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
]

interface MapDescription {
    id: string,
    edit_name: string,
    types: string
    max_length?: number,
    place_holder?: string,
    required?: boolean,
    cols?: number,
    withLabel?: string,
    withCols?: number
}
interface LoadMaps {
    table: string;
    data1: Array<Array<MapDescription>>;
    data2: Array<GridField>;
}
interface GridField {
    id: string;
    show_name: string;
    edit_name: string;
    sortable: boolean;
}
interface TableFieldModal {
    field_name: string
    length: number
    allow_null: boolean
    types: string
}
//頂端元件
interface TopNodeProps {
}
interface TopNodeState {
    dataMap?: LoadMaps,
    tableFieldModal?: Array<TableFieldModal>
    jsxResult?: string
    //gridFields?: Array<GridField>
}

class TopNode extends React.Component<TopNodeProps, TopNodeState>{
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
            id: guid(),
            edit_name: null,
            show_name: null,
            sortable: false
        });
        this.setState(state)
    }
    clickDelGridField(i, e) {
        let state = this.state;
        state.dataMap.data2.splice(i, 1);
        this.setState(state);
    }
    onChangeInputGridName(i, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.data2[i].show_name = input.value;
        this.setState(state)
    }
    onChangeInputGridLink(i, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.data2[i].edit_name = input.value;
        this.setState(state)
    }
    onChangeInputGridSort(i, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.data2[i].sortable = !state.dataMap.data2[i].sortable;
        this.setState(state)
    }

    clickDelCell(i, j, e) {

        let state = this.state;
        state.dataMap.data1[i].splice(j, 1);
        this.setState(state);
    }
    clickAddRow(e) {
        let state = this.state;
        state.dataMap.data1.push([]);
        this.setState(state)
    }
    clickAddField(i, e) {
        let state = this.state;
        state.dataMap.data1[i].push({
            id: guid(),
            edit_name: null,
            types: 'text',
            max_length: 0,
            required: true,
            place_holder: '',
            cols: 5,
            withCols: 2,
            withLabel: ''
        });
        this.setState(state)
    }
    clickDelRow(i, e) {
        let state = this.state;
        state.dataMap.data1.splice(i, 1);
        this.setState(state)
    }
    onChangeInputCheck(i, j, name, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.data1[i][j][name] = !state.dataMap.data1[i][j][name];
        this.setState(state)
    }
    onChangeInputEdit(i, j, name, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.data1[i][j][name] = input.value;
        this.setState(state)
    }
    onChangeTable(e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let state = this.state;
        state.dataMap.table = input.value;
        this.setState(state)
    }
    clickLoad(e) {
        let table = this.state.dataMap.table;
        let _self = this;
        fetchGet<any>('/Template/Load', { table_name: table }).then((data) => {
            _self.setState({
                tableFieldModal: data.field,
                dataMap: data.json
            });
        })
    }
    clickSave(e) {
        let postData = this.state.dataMap;

        fetchPost<any>('/Template/Save', postData).then((data) => {
            //console.log(data.jsxResult);
            this.setState({ jsxResult: data.jsxResult });
        })
    }
    setDefaultValue(i, j, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let n = parseInt(input.value, 10);
        let field = this.state.tableFieldModal[n];

        let state = this.state;
        let item = state.dataMap.data1[i][j];

        item.edit_name = field.field_name;
        item.required = !field.allow_null;
        item.max_length = field.length;
        item.withLabel = field.field_name;

        this.setState(state)
    }
    setDefaultGrid(i, e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let n = parseInt(input.value, 10);
        let field = this.state.tableFieldModal[n];

        let state = this.state;
        let item = state.dataMap.data2[i];
        item.edit_name = field.field_name;
        this.setState(state)
    }

    render() {
        //console.log('state', this.state.tableFieldModal);
        let warp = this.state.dataMap.data1;
        let gridFields = this.state.dataMap.data2 ? this.state.dataMap.data2 : [];
        return <div>
            <div>
                <label>Table:</label>
                <input type="text" value={this.state.dataMap.table} onChange={this.onChangeTable} />
                <button type="button" onClick={this.clickLoad}>Load</button>
            </div>

            <div>
                <button type="button" onClick={this.clickSave}>Save</button>
            </div>

            <button type="button" onClick={this.clickAddGridField}>Add Grid Field</button>
            <table>
                <tr>
                    {
                        gridFields.map((item, i) => {
                            return <td id={item.id}>
                                <button type="button" onClick={this.clickDelGridField.bind(this, i)}>Del</button>
                                <div>
                                    <label>名稱:</label>
                                    <input type="text" value={item.show_name} onChange={this.onChangeInputGridName.bind(this, i)} />
                                </div>
                                <div><label>對映:</label>
                                    <LinkFieldInput onChangeInputEditName={this.onChangeInputGridLink.bind(this, i)}
                                        value={item.edit_name}
                                        tableFieldModal={this.state.tableFieldModal}
                                        setDefaultValue={this.setDefaultGrid.bind(this, i)}
                                    />
                                </div>
                                <div>
                                    <label>排序:</label>
                                    <input type="checkbox" value="1" checked={item.sortable == true} onChange={this.onChangeInputGridSort.bind(this, i)} />
                                </div>
                            </td>;
                        })
                    }
                </tr>
            </table>
            <hr />
            <button type="button" onClick={this.clickAddRow}>Add Row</button>
            <table>
                {
                    warp.map((warpCol, i) => {
                        return <tr key={i}>
                            <td style={{ verticalAlign: "top" }}><button type="button" onClick={this.clickDelRow.bind(this, i)}>Del Row</button></td>
                            <td style={{ verticalAlign: "top" }}><button type="button" onClick={this.clickAddField.bind(this, i)}>Add Field</button></td>
                            {
                                warpCol.map((item, j) => {
                                    return <td key={item.id}>
                                        <WarpFram warpContext={item} iIndex={i} jIndex={j}
                                            clickDelCell={this.clickDelCell}
                                            onChangeCheckType={this.onChangeInputCheck.bind(this, i, j)}
                                            onChangeInputEditName={this.onChangeInputEdit.bind(this, i, j)}
                                            setDefaultValue={this.setDefaultValue.bind(this, i, j)}
                                            tableFieldModal={this.state.tableFieldModal}
                                        />
                                    </td>;
                                })
                            }</tr>
                    })
                }
            </table>
            <textarea value={this.state.jsxResult} rows={400} cols={180} />
        </div >;
    }
}

interface WarpFramProps {
    warpContext: MapDescription;
    iIndex: number;
    jIndex: number;
    clickDelCell: Function;
    onChangeCheckType: React.ChangeEventHandler<any>
    onChangeInputEditName: React.ChangeEventHandler<any>
    setDefaultValue: React.ChangeEventHandler<any>;
    tableFieldModal?: Array<TableFieldModal>
}
class WarpFram extends React.Component<WarpFramProps, any>{
    constructor() {
        super();
    }
    render() {

        let pp = this.props;
        //console.log('pp', pp.tableFieldModal)
        return <div>
            <button type="button" onClick={this.props.clickDelCell.bind(this, pp.iIndex, pp.jIndex)}>
                Del
            </button><br />
            Link Field :
            <LinkFieldInput
                value={pp.warpContext.edit_name}
                onChangeInputEditName={pp.onChangeInputEditName.bind(this, "edit_name")}
                setDefaultValue={pp.setDefaultValue}
                tableFieldModal={pp.tableFieldModal}
            />
            <br />
            Type       :<select value={pp.warpContext.types} onChange={pp.onChangeInputEditName.bind(this, "types")}>
                {
                    optionType.map((option, k) => {
                        return <option key={option} value={option}>{option}</option>
                    })
                }
            </select><br />
            WithLabel :<input type="text" value={pp.warpContext.withLabel} onChange={pp.onChangeInputEditName.bind(this, "withLabel")} /><br />
            With Cols :<input type="number" value={pp.warpContext.withCols} onChange={pp.onChangeInputEditName.bind(this, "withCols")} /><br />
            Max Length :<input type="text" value={pp.warpContext.max_length} onChange={pp.onChangeInputEditName.bind(this, "max_length")} /><br />
            PlaceHolder:<input type="text" value={pp.warpContext.place_holder} onChange={pp.onChangeInputEditName.bind(this, "place_holder")} /><br />
            Requirded  :<input type="checkbox" value="1" checked={pp.warpContext.required == true} onChange={pp.onChangeCheckType.bind(this, "required")} /><br />
            Cols       :<input type="number" value={pp.warpContext.cols} onChange={pp.onChangeInputEditName.bind(this, "cols")} />
        </div>
    }
}

interface LinkFieldInputProps {
    value: string
    onChangeInputEditName: React.ChangeEventHandler<any>;
    setDefaultValue: React.ChangeEventHandler<any>;
    tableFieldModal?: Array<TableFieldModal>
}
interface LinkFieldInputState {

}

class LinkFieldInput extends React.Component<LinkFieldInputProps, LinkFieldInputState>{
    constructor() {
        super();
    }

    render() {
        return <span>
            <input type="text" value={this.props.value} onChange={this.props.onChangeInputEditName} />
            <select onChange={this.props.setDefaultValue}>
                {
                    this.props.tableFieldModal.map((item, i) => {
                        return <option value={i}>{item.field_name}</option>
                    })
                }
            </select>
        </span>;
    }
}

var dom = document.getElementById('main');
render(<TopNode />, dom);