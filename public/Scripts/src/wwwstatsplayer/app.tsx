import React = require('react');
import { render } from 'react-dom';
import { ft } from '../../comm/ajax';
import { stdNumber } from '../../comm/comm-func';
import api from '../../comm/api';
import * as moment from 'moment';
import update = require('react-addons-update');

interface StatsPlayerState {
    static_data?: Array<server.StaticPlayerUnion>
    show_type?: string
    query?: {
        playname_id?: number
        area_sn?: string
        divide_id?: number
        keyword?:string
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

        let params = this.state.query;

        ft<Array<server.StaticTeamUnion>>(api.GET__api_Utility_GetStatsPlayer, params)
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

        return <div>
            <form className="wrap field mb-48">
                <select className="form-element w-15 mr-12" value={query.playname_id} onChange={this.chgQuery.bind(this, 'playname_id')}>
                    {
                        jsinit.play_name.map((item, i) => {
                            return <option key={item.playname_id} value={item.playname_id}>{item.play_name}</option>
                        })
                    }
                </select>
                <select className="form-element w-15 mr-12" value={query.area_sn} onChange={this.chgQuery.bind(this, 'area_sn')}>
                    {
                        jsinit.divide.map((item, i) => {
                            return <option key={'area_sn-' + i} value={item.area_sn}>{area_sn_name[item.area_sn]}</option>;
                        })
                    }
                </select>
                <select className="form-element w-15 mr-12" value={query.divide_id} onChange={this.chgQuery.bind(this, 'divide_id')}>
                    <option value="">全部分組</option>
                    {divide_item ?
                        divide_item.items.map((item, i) => {
                            return <option key={'divide_id-' + i} value={item.play_divide_id}>{item.divide_name}</option>;
                        }) : null
                    }
                </select>
                <input type="text" className="form-element w-20 mr-12"
                    value={query.keyword} onChange={this.chgQuery.bind(this, 'keyword')}
                    placeholder="請輸入球員或球隊"
                />
                <button type="button" className="btn warning" onClick={this.ajaxQuery}>搜尋</button>
            </form>
            <section className="wrap">
                <header className="clearfix">
                    <h3 className="mt-0 pull-left text-left">2017 季賽 <small>[全區] [全部分組]</small></h3>
                    <nav className="pull-right btn-group">
                        <button type="button" className={'btn-toggle' + (this.state.show_type == 'total' ? ' active' : '')} onClick={this.showTotal}>總和</button>
                        <button type="button" className={'btn-toggle' + (this.state.show_type == 'average' ? ' active' : '')} onClick={this.showAverage}>平均</button>
                    </nav>
                </header>
                <div className="table-rwd">
                    <table className="table-line table-hover">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="text-left">球員</th>
                                <th rowSpan={2}>背號</th>
                                <th rowSpan={2} className="text-left">球隊</th>
                                <th rowSpan={2}>出場次數</th>
                                <th colSpan={4}>二分球</th>
                                <th colSpan={4}>三分球</th>
                                <th colSpan={4}>罰球</th>
                                <th colSpan={3}>籃板</th>
                                <th rowSpan={2}>助攻</th>
                                <th rowSpan={2}>抄截</th>
                                <th rowSpan={2}>阻攻</th>
                                <th rowSpan={2}>失誤</th>
                                <th rowSpan={2}>犯規</th>
                                <th rowSpan={2}>得分</th>
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

                                        let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : stdNumber(item.Y2 * 100 / (item.Y2 + item.N2), 2);
                                        let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                                        let rate_bp = item.YP + item.NP === 0 ? 0 : stdNumber(item.YP * 100 / (item.YP + item.NP), 2);

                                        return <tr>
                                            <td className="text-left">
                                                <a href={gb_approot + 'Player?id=' + item.player_id} className="hover-danger">
                                                    {item.player_name}
                                                </a>
                                            </td>
                                            <td>{item.jersey_number}</td>
                                            <td className="text-left">{item.team_name}</td>
                                            <td>{item.num}</td>
                                            <td className="text-right text-nowarp">{item.Y2 ? item.Y2 : 0}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{item.Y2 + item.N2}</td>
                                            <td className="text-right text-nowarp">({rate_b2 ? rate_b2 : 0}%)</td>
                                            <td className="text-right text-nowarp">{item.Y3 ? item.Y3 : 0}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{item.Y3 + item.N3}</td>
                                            <td className="text-right text-nowarp">({rate_b3 ? rate_b3 : 0}%)</td>
                                            <td className="text-right text-nowarp">{item.YP ? item.YP : 0}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{item.YP + item.NP}</td>
                                            <td className="text-right text-nowarp">({rate_bp ? rate_bp : 0}%)</td>
                                            <td className="text-right text-nowarp">{item.ARebounds}</td>
                                            <td className="text-right text-nowarp">{item.DRebounds}</td>
                                            <td className="text-right text-nowarp">{item.ARebounds + item.DRebounds}</td>
                                            <td className="text-right text-nowarp">{item.ast}</td>
                                            <td className="text-right text-nowarp">{item.stl}</td>
                                            <td className="text-right text-nowarp">{item.blk}</td>
                                            <td className="text-right text-nowarp">{item.turnovers}</td>
                                            <td className="text-right text-nowarp">{item.foul}</td>
                                            <td className="text-right text-nowarp">{item.Score}</td>
                                        </tr>;
                                    })
                                    :
                                    static_data.map((item, i) => {

                                        let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : stdNumber(item.Y2 * 100 / (item.Y2 + item.N2), 2);
                                        let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                                        let rate_bp = item.YP + item.NP === 0 ? 0 : stdNumber(item.YP * 100 / (item.YP + item.NP), 2);

                                        return <tr>
                                            <td className="text-left">
                                                <a href={gb_approot + 'Player/id=' + item.player_id} className="hover-danger">
                                                    {item.player_name}
                                                </a>
                                            </td>
                                            <td>{item.jersey_number}</td>
                                            <td className="text-left">{item.team_name}</td>
                                            <td>{item.num}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.Y2 / item.num, 2)}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{stdNumber((item.Y2 + item.N2) / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">({rate_b2}%)</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.Y3 / item.num, 2)}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{stdNumber((item.Y3 + item.N3) / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">({rate_b3}%)</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.YP / item.num, 2)}</td>
                                            <td className="text-nowarp">-</td>
                                            <td className="text-left text-nowarp">{stdNumber((item.YP + item.NP) / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">({rate_bp}%)</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.ARebounds / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.DRebounds / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber((item.ARebounds + item.DRebounds) / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.ast / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.stl / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.blk / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.turnovers / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.foul / item.num, 2)}</td>
                                            <td className="text-right text-nowarp">{stdNumber(item.Score / item.num, 2)}</td>
                                        </tr>;
                                    })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>;
    }
}

var dom = document.getElementById('reactroot');
render(<StatsPlayer />, dom);