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
        orderby?: string
    }
}

let week_name = ['日', '一', '二', '三', '四', '五', '六'];
let area_sn_name = {
    'N': '北區',
    'S': '南區'
}
let mm_options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
class StatsRanking extends React.Component<any, StatsPlayerState>{

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
                playname_id: null,
                area_sn: 'N',
                divide_id: null
            }
        }
    }
    componentWillMount() {
        this.ajaxQuery();
    }

    ajaxQuery() {

        let params = this.state.query;

        ft<Array<server.StaticTeamUnion>>(api.GET__api_Utility_GetStatsRanking, params)
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
                <select className="form-element w-15 mr-12"
                    value={query.area_sn}
                    onChange={this.chgQuery.bind(this, 'area_sn')}
                    defaultValue={'N'}
                >

                    {
                        jsinit.divide.map((item, i) => {
                            return <option key={'area_sn-' + i} value={item.area_sn}>{area_sn_name[item.area_sn]}</option>;
                        })
                    }
                </select>
                <select className="form-element w-15 mr-12" value={query.divide_id} onChange={this.chgQuery.bind(this, 'divide_id')}>

                    {divide_item ?
                        divide_item.items.map((item, i) => {
                            return <option key={'divide_id-' + i} value={item.play_divide_id}>{item.divide_name}</option>;
                        }) : null
                    }
                </select>

                <select className="form-element w-15 mr-12"
                    value={query.orderby}
                    defaultValue={'score'}
                    onChange={this.chgQuery.bind(this, 'orderby')}>
                    <option value={'rate_all'}>投籃命中率</option>
                    <option value={'rate_3'}>三分球命中率</option>
                    <option value={'score'}>得分</option>
                    <option value={'rebounds'}>籃板</option>
                    <option value={'ast'}>助攻</option>
                    <option value={'stl'}>抄截</option>
                    <option value={'blk'}>阻攻</option>
                </select>

                <button type="button" className="btn warning" onClick={this.ajaxQuery}>搜尋</button>
            </form>
            <section className="wrap">
                <header className="clearfix">
                    <h3 className="mt-0 pull-left text-left">2017 季賽 <small>[全區] [全部分組]</small></h3>
                </header>
                <div className="table-rwd">
                    <table className="table-line table-hover">
                        <thead>
                            <tr>
                                <th className="item-ranking">排名</th>
                                <th className="text-left">球員</th>
                                <th className="text-left">球隊</th>
                                <th>出場次數</th>
                                <th className="text-right">投籃%</th>
                                <th className="text-right">三分%</th>
                                <th className="text-right">籃板</th>
                                <th className="text-right">助攻</th>
                                <th className="text-right">抄截</th>
                                <th className="text-right">阻攻</th>
                                <th className="text-right">得分</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                static_data.map((item, i) => {

                                    let rate_b2 = item.Y2 + item.N2 === 0 ? 0 : stdNumber(item.Y2 / (item.Y2 + item.N2), 2);
                                    let rate_b3 = item.Y3 + item.N3 === 0 ? 0 : stdNumber(item.Y3 * 100 / (item.Y3 + item.N3), 2);
                                    let rate_bp = item.YP + item.NP === 0 ? 0 : stdNumber(item.YP / (item.YP + item.NP), 2);

                                    let rate_all = (item.Y2 + item.N2 + item.Y3 + item.N3 + item.YP + item.NP) === 0 ?
                                        0 : (item.Y2 + item.Y3 + item.N3 + item.YP) * 100 / (item.Y2 + item.N2 + item.Y3 + item.N3 + item.YP + item.NP)
                                    //alert(rate_all)

                                    return <tr>
                                        <td>{i + 1}</td>
                                        <td className="text-left">{item.player_name}</td>
                                        <td className="item-team">{item.team_name}</td>
                                        <td>{item.num}</td>
                                        <td className="text-right">{stdNumber(rate_all, 2)}</td>
                                        <td className="text-right">{rate_b3}</td>
                                        <td className="text-right">{item.ARebounds + item.DRebounds}</td>
                                        <td className="text-right">{item.ast}</td>
                                        <td className="text-right">{item.stl}</td>
                                        <td className="text-right">{item.blk}</td>
                                        <td className="text-right">{item.Score}</td>
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
render(<StatsRanking />, dom);