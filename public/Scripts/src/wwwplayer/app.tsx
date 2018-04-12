import React = require('react');
import { render } from 'react-dom';
import { ft } from '../../comm/ajax';
import { stdNumber } from '../../comm/comm-func';
import api from '../../comm/api';
import * as moment from 'moment';
import update = require('react-addons-update');

declare var player_id: number;

interface StatsPlayerState {
    static_data?: Array<server.StaticPlayerUnion>
    show_type?: string
    query?: {
        playname_id?: number
        area_sn?: string
        divide_id?: number
    }
}

let week_name = ['日', '一', '二', '三', '四', '五', '六'];
let area_sn_name = {
    'N': '北區',
    'S': '南區'
}
let mm_options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

//取得今年度賽季
const yy_play = jsinit.play_name.filter(x => x.yy == jsinit.yy);
const f_playname = yy_play.length > 0 ? yy_play[0].playname_id : jsinit.play_name[0].playname_id;

class StatsPlayer extends React.Component<any, StatsPlayerState>{

    constructor() {
        super();

        this.chgQuery = this.chgQuery.bind(this);
        this.ajaxQuery = this.ajaxQuery.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.showTotal = this.showTotal.bind(this);
        this.showAverage = this.showAverage.bind(this);
        this.state = {
            static_data: [],
            show_type: 'total', //分成總和及平均 total:average
            query: {
                playname_id: f_playname,//預設今年度賽季第一個
                area_sn: jsinit.divide[0].area_sn,//預設北區
                divide_id: null
            }
        }
    }
    componentWillMount() {
        this.ajaxQuery();
    }

    ajaxQuery() {

        let params = { id: player_id };

        ft<Array<server.StaticTeamUnion>>(api.GET__api_Utility_GetPlayerData, params)
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
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;

        let new_state = update(this.state.query, {
            [name]: { $set: value }
        })

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

        return <section className="wrap">
            <header className="clearfix">
                <h3 className="mt-0 pull-left text-left">單季數據</h3>
                <nav className="pull-right btn-group">
                    <button type="button" className={'btn-toggle' + (this.state.show_type == 'total' ? ' active' : '')} onClick={this.showTotal}>總和</button>
                    <button type="button" className={'btn-toggle' + (this.state.show_type == 'average' ? ' active' : '')} onClick={this.showAverage}>平均</button>
                </nav>
            </header>

            <table className="table-line table-hover">
                <thead>
                    <tr>
                        <th rowSpan={2}>背號</th>
                        <th rowSpan={2}>出場次數</th>
                        <th colSpan={4} style={{"width":"12.8%"}}>二分球</th>
                        <th colSpan={4} style={{ "width": "12.8%" }}>三分球</th>
                        <th colSpan={4} style={{ "width": "12.8%" }}>罰球</th>
                        <th colSpan={3} style={{ "width": "12.2%" }}>籃板</th>
                        <th rowSpan={2} className="text-right">助攻</th>
                        <th rowSpan={2} className="text-right">抄截</th>
                        <th rowSpan={2} className="text-right">阻攻</th>
                        <th rowSpan={2} className="text-right">失誤</th>
                        <th rowSpan={2} className="text-right">犯規</th>
                        <th rowSpan={2} className="text-right">得分</th>
                    </tr>
                    <tr>
                        <th className="text-right text-nowarp">進球</th>
                        <th className="text-nowarp">-</th>
                        <th className="text-left text-nowarp">出手</th>
                        <th className="text-right text-nowarp">(命中率)</th>
                        <th className="text-right text-nowarp">進球</th>
                        <th className="text-nowarp">-</th>
                        <th className="text-left text-nowarp">出手</th>
                        <th className="text-right text-nowarp">(命中率)</th>
                        <th className="text-right text-nowarp">進球</th>
                        <th className="text-nowarp">-</th>
                        <th className="text-left text-nowarp">出手</th>
                        <th className="text-right text-nowarp">(命中率)</th>
                        <th className="text-right text-nowarp">進攻</th>
                        <th className="text-right text-nowarp">防守</th>
                        <th className="text-right text-nowarp">總計</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.show_type == 'total' ?
                            static_data.map((item, i) => {

                                let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : stdNumber(item.Y2*100 / (item.Y2 + item.N2), 2);
                                let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : stdNumber(item.Y3*100 / (item.Y3 + item.N3), 2);
                                let rate_bp = item.YP + item.NP === 0 ? 0 : stdNumber(item.YP*100 / (item.YP + item.NP), 2);

                                return <tr key={'total-' + item.player_id}>
                                    <td>{item.jersey_number}</td>
                                    <td>{item.num}</td>
                                    <td className="text-right">{item.Y2 ? item.Y2 : 0}</td>
                                    <td>-</td>
                                    <td className="text-left">{item.Y2 + item.N2}</td>
                                    <td className="text-right">({rate_b2 ? rate_b2 : 0}%)</td>
                                    <td className="text-right">{item.Y3 ? item.Y3 : 0}</td>
                                    <td>-</td>
                                    <td className="text-left">{item.Y3 + item.N3}</td>
                                    <td className="text-right">({rate_b3 ? rate_b3 : 0}%)</td>
                                    <td className="text-right">{item.YP ? item.YP : 0}</td>
                                    <td>-</td>
                                    <td className="text-left">{item.YP + item.NP}</td>
                                    <td className="text-right">({rate_bp ? rate_bp : 0}%)</td>
                                    <td className="text-right">{item.ARebounds}</td>
                                    <td className="text-right">{item.DRebounds}</td>
                                    <td className="text-right">{item.ARebounds + item.DRebounds}</td>
                                    <td className="text-right">{item.ast}</td>
                                    <td className="text-right">{item.stl}</td>
                                    <td className="text-right">{item.blk}</td>
                                    <td className="text-right">{item.turnovers}</td>
                                    <td className="text-right">{item.foul}</td>
                                    <td className="text-right">{item.Score}</td>
                                </tr>;
                            })
                            :
                            static_data.map((item, i) => {

                                let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : stdNumber(item.Y2 / (item.Y2 + item.N2), 2);
                                let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : stdNumber(item.Y3 / (item.Y3 + item.N3), 2);
                                let rate_bp = item.YP + item.NP === 0 ? 0 : stdNumber(item.YP / (item.YP + item.NP), 2);

                                return <tr key={'average-' + item.player_id}>
                                    <td>{item.jersey_number}</td>
                                    <td>{item.num}</td>
                                    <td className="text-right">{stdNumber(item.Y2 / item.num, 2)}</td>
                                    <td>-</td>
                                    <td className="text-left">{stdNumber((item.Y2 + item.N2) / item.num, 2)}</td>
                                    <td className="text-right">({rate_b2}%)</td>
                                    <td className="text-right">{stdNumber(item.Y3 / item.num, 2)}</td>
                                    <td>-</td>
                                    <td className="text-left">{stdNumber((item.Y3 + item.N3) / item.num, 2)}</td>
                                    <td className="text-right">({rate_b3}%)</td>
                                    <td className="text-right">{stdNumber(item.YP / item.num, 2)}</td>
                                    <td>-</td>
                                    <td className="text-left">{stdNumber((item.YP + item.NP) / item.num, 2)}</td>
                                    <td className="text-right">({rate_bp}%)</td>
                                    <td className="text-right">{stdNumber(item.ARebounds / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.DRebounds / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber((item.ARebounds + item.DRebounds) / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.ast / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.stl / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.blk / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.turnovers / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.foul / item.num, 2)}</td>
                                    <td className="text-right">{stdNumber(item.Score / item.num, 2)}</td>
                                </tr>;
                            })
                    }
                </tbody>
            </table>
        </section>;
    }
}

var dom = document.getElementById('reactroot');
render(<StatsPlayer />, dom);