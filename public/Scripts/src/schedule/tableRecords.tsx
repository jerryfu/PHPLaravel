import React = require('react');
import { PWButton, SelectText, InputText, InputNum, RadioText, CheckText } from '../../comm/components';
import { config, modal_css, pw_rule } from '../../comm/defData';
import { sumCdn, fmtSource, sumSource } from './func';
import ReactTypeahead from '../../comm/comm-typeahead';
import { fetchGet } from '../../comm/ajax';
import update = require('react-addons-update');

interface TableRecordProps {
    loadRecord?: Function,
    records?: RecordUnit,
    chgFldVal?: Function,
    addPlayerToSchedule?: Function
}

export default class TableRecord extends React.Component<TableRecordProps, any>{

    constructor() {
        super();
        this.chgTypeAhead = this.chgTypeAhead.bind(this);
        this.state = {
            getPlayer: {
                player_id: null,
                player_name: null
            }
        }
    }

    chgTypeAhead(id, text, data) {

        //console.log('check data', data)
        //alert(data);
        let { records } = this.props;

        if (confirm('確定是否增加球員[' + text + ']')) {
            let struct = {
                getPlayer: {
                    player_id: { $set: id },
                    player_name: { $set: data.player_name },
                    //jersey_number: { $set: data.jersey_number },
                    //team_name: { $set: records.team_name }
                }
            };

            var n_state = update(this.state, struct);
            this.setState(n_state)
            this.props.addPlayerToSchedule(id, data.player_name, data.jersey_number, data.team_name)
        } else {
            let struct = {
                getPlayer: {
                    player_id: { $set: null },
                    player_name: { $set: null }
                }
            };
            var n_state = update(this.state, struct);
            this.setState(n_state)
        }
    }

    render() {
        let pp = this.props;
        let sum_Y3: number = 0;
        let activeItem = pp.records.data.filter(x => x.active == true);

        let sortItem = pp.records.data.slice();

        sortItem.sort((x, y) => {
            return (x === y) ? 0 : x.active ? -1 : 1; //
        });

        return <table className="table-list table-hover table-striped">
            <caption>
                {pp.records.team_name}
                ({activeItem.sum(x => { return sumSource(x.Y3, x.Y2, x.YP) })})
                <ReactTypeahead apiPath={gb_approot + 'api/Player/Query'}
                    onCompleteChange={this.chgTypeAhead}
                    value={this.state.getPlayer.player_name}
                    dataTextFunc={(data: server.Player) => {
                        return data.player_name + '[' + data.idno + '][' + data.team_name + '][' + data.jersey_number + ']';
                    }}
                />
            </caption>
            <thead>
                <tr>
                    <th className="item-edit bg-dark" rowSpan={2}>參與</th>
                    <th className="bg-dark" rowSpan={2}>背號</th>
                    <th className="bg-dark" rowSpan={2}>姓名</th>
                    <th className="bg-dark" colSpan={2}>3分投籃</th>
                    <th className="bg-dark" colSpan={2}>2分投籃</th>
                    <th className="bg-dark" colSpan={2}>罰球</th>
                    <th className="bg-dark" rowSpan={2}>得分</th>
                    <th className="bg-dark" colSpan={2}>籃板球</th>
                    <th className="bg-dark" rowSpan={2}>助攻</th>
                    <th className="bg-dark" rowSpan={2}>抄截</th>
                    <th className="bg-dark" rowSpan={2}>阻攻</th>
                    <th className="bg-dark" rowSpan={2}>失誤</th>
                    <th className="bg-dark" rowSpan={2}>犯規</th>
                </tr>
                <tr>
                    <th className="bg-dark">
                        中籃
                    </th>
                    <th className="bg-dark">
                        不中籃
                    </th>
                    <th className="bg-dark">
                        中籃
                    </th>
                    <th className="bg-dark">
                        不中籃
                    </th>
                    <th className="bg-dark">
                        中籃
                    </th>
                    <th className="bg-dark">
                        不中籃
                    </th>

                    <th className="bg-dark">
                        進 攻
                    </th>
                    <th className="bg-dark">
                        防守
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    sortItem.map((item, i) => {

                        sum_Y3 += sumCdn(item.Y3, item.active);

                        return <tr key={'player_' + item.player_id}>
                            <td>
                                <label htmlFor={'active_' + item.player_id} className="switch">
                                    <CheckText
                                        id={'active_' + item.player_id}
                                        onClick={pp.chgFldVal.bind(this, item.player_id, 'active')}
                                        inputViewMode={InputViewMode.edit}
                                        checked={item.active}
                                        value={item.player_id}
                                    />
                                    <div className="slider round"></div>
                                </label>
                                {/*<label htmlFor={'active_' + item.player_id} />*/}
                            </td>
                            <td>
                                <InputText
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'jersey_number')}
                                    value={item.jersey_number}
                                    required={true}
                                />
                            </td>
                            <td className="word-keep">
                                <InputText
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'player_name')}
                                    value={item.player_name}
                                    required={true}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'Y3')}
                                    value={item.Y3}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'N3')}
                                    value={item.N3}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'Y2')}
                                    value={item.Y2}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'N2')}
                                    value={item.N2}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'YP')}
                                    value={item.YP}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'NP')}
                                    value={item.NP}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>{fmtSource(item.Y3, item.Y2, item.YP)}</td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'ARebounds')}
                                    value={item.ARebounds}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'DRebounds')}
                                    value={item.DRebounds}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'ast')}
                                    value={item.ast}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'stl')}
                                    value={item.stl}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'blk')}
                                    value={item.blk}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'turnovers')}
                                    value={item.turnovers}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                            <td>
                                <InputNum
                                    inputClassName="text-center"
                                    onChange={pp.chgFldVal.bind(this, item.player_id, 'foul')}
                                    value={item.foul}
                                    required={false}
                                    onlyPositive={true}
                                    disabled={!item.active}
                                />
                            </td>
                        </tr>;
                    })
                }
            </tbody>
            <tfoot className="sum">
                <tr>
                    <td colSpan={3}>總計</td>
                    <td>{sum_Y3}</td>
                    <td>{activeItem.sum(x => x.N3)}</td>
                    <td>{activeItem.sum(x => x.Y2)}</td>
                    <td>{activeItem.sum(x => x.N2)}</td>
                    <td>{activeItem.sum(x => x.YP)}</td>
                    <td>{activeItem.sum(x => x.NP)}</td>
                    <td>{activeItem.sum(x => { return sumSource(x.Y3, x.Y2, x.YP) })}</td>
                    <td>{activeItem.sum(x => x.ARebounds)}</td>
                    <td>{activeItem.sum(x => x.DRebounds)}</td>
                    <td>{activeItem.sum(x => x.ast)}</td>
                    <td>{activeItem.sum(x => x.stl)}</td>
                    <td>{activeItem.sum(x => x.blk)}</td>
                    <td>{activeItem.sum(x => x.turnovers)}</td>
                    <td>{activeItem.sum(x => x.foul)}</td>
                </tr>
            </tfoot>
        </table>
    }
}