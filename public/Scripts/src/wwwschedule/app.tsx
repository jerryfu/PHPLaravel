import React = require('react');
import { render } from 'react-dom';
import { ft } from '../../comm/ajax';
import api from '../../comm/api';
import * as moment from 'moment';
import update = require('react-addons-update');



interface SchDetail {
    schedule_id: number;
    set_date: string;
    sno: string;
    home_team_id: number;
    home_team_name: string;
    visiting_team_id: number;
    visiting_team_name: string;
    divide_name: string;
    site_name: string;
    address: string;

    home_score: number;
    visiting_score: number;
}
interface SchMaster {
    mm: string
    area_sn: string
    items: Array<SchDetail>
}
interface ScheduleState {
    schedule_data?: Array<SchMaster>
    schedule_query?: {
        mm?: number
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
class Schedule extends React.Component<any, ScheduleState>{

    constructor() {
        super();

        this.chgQuery = this.chgQuery.bind(this);
        this.ajaxQuery = this.ajaxQuery.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.state = {
            schedule_data: [],
            schedule_query: {
                mm: (moment().month() + 1),
                area_sn: null,
                divide_id: null
            }
        }
    }
    componentWillMount() {
        this.ajaxQuery();
    }

    ajaxQuery() {

        let params = this.state.schedule_query;

        ft<Array<SchMaster>>(api.GET__api_Utility_GetSchudel, params)
            .then((res) => {
                this.setState({ schedule_data: res });
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

        let new_state = update(this.state.schedule_query, {
            [name]: { $set: value }
        })

        this.setState({
            schedule_query: new_state
        });
    }
    render() {
        let { schedule_data } = this.state;
        let query = this.state.schedule_query;
        let divide_item = jsinit.divide.find(x => x.area_sn == query.area_sn);

        return <div>
            <h1 className="mb-24">{jsinit.yy} 季賽 賽程表</h1>
            <form className="wrap field mb-48" onSubmit={this.submitQuery}>
                <select className="form-element w-15 mr-12" value={query.mm} onChange={this.chgQuery.bind(this, 'mm')}>
                    <option value="">全年</option>
                    {
                        mm_options.map(x => {
                            return <option key={'mm-' + x} value={x}>{x}月</option>;
                        })
                    }
                </select>
                <select className="form-element w-15 mr-12" value={query.area_sn} onChange={this.chgQuery.bind(this, 'area_sn')}>
                    <option value="">全區</option>
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
                <button type="submit" className="btn warning">搜尋</button>
            </form>
            {
                schedule_data.map((item, i) => {

                    return <section key={'schedule-' + i} className="wrap">
                        <div className="table-rwd">
                            <table className="table-line table-hover sortable">
                                <caption className="text-left">{item.mm}月 {area_sn_name[item.area_sn]}</caption>
                                <colgroup>
                                    <col style={{ width: '10%' }} />
                                    <col span={3} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '4%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '12%' }} />
                                    <col style={{ width: '15%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>日期</th>
                                        <th>#</th>
                                        <th>時間</th>
                                        <th>分組</th>
                                        <th className="text-right">主隊</th>
                                        <th className="sorttable_nosort"></th>
                                        <th className="text-left">客隊</th>
                                        <th>比分</th>
                                        <th>地點</th>
                                    </tr>
                                </thead>
                                {
                                    item.items.map((sub, j) => {
                                        let set_data = moment(sub.set_date);
                                        return <tbody key={'schedule-' + i + '_sub-' + j}>
                                            <tr>
                                                <td><strong>{set_data.date()}</strong>
                                                    ({week_name[set_data.weekday()]})
                                                    </td>
                                                <td>{sub.sno}</td>
                                                <td>{set_data.format('HH:mm')}</td>
                                                <td>{sub.divide_name}</td>
                                                <td className="text-right">
                                                    {
                                                        sub.home_score > sub.visiting_score ?
                                                            <span className="label label-success circle">勝</span> : <span></span>
                                                    }
                                                    {' '}
                                                    {sub.home_team_name}
                                                </td>
                                                <td>vs</td>
                                                <td className="text-left">
                                                    {sub.visiting_team_name}
                                                    {' '}
                                                    {
                                                        sub.visiting_score > sub.home_score ?
                                                            <span className="label label-success circle">勝</span> : <span></span>
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (sub.home_score != null && sub.visiting_score != null) ?
                                                            <a href={gb_approot + 'Schedule/Result?id=' + sub.schedule_id} className="hover-danger">
                                                                {sub.home_score} - {sub.visiting_score}
                                                            </a> : <span>-</span>
                                                    }
                                                </td>
                                                <td><a href={"https://www.google.com.tw/maps?q=" + sub.address} target="_blank">{sub.site_name}</a></td>
                                            </tr>
                                        </tbody>
                                    })
                                }
                            </table>
                        </div>
                    </section>;
                })
            }
        </div>;
    }
}

var dom = document.getElementById('reactroot');
render(<Schedule />, dom);