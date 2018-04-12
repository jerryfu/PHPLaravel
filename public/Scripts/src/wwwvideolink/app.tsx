import React = require('react');
import { render } from 'react-dom';
import { ft } from '../../comm/ajax';
import api from '../../comm/api';
import * as moment from 'moment';
import update = require('react-addons-update');

interface ScheduleState {
    data?: Array<server.VideoLink>,
    hasMoreItems?: boolean,
    page?: number,
    active?: boolean
}

class VideoLink extends React.Component<any, ScheduleState>{

    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            data: [],
            hasMoreItems: true,
            page: 0,
            active: false
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.ajaxQuery();
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    ajaxQuery() {
        let self = this;
        let page = this.state.page + 1;
        let tm = { page: page };

        ft<ReturnData<GridInfo<server.VideoLink>>>(api.GET__api_Utility_GetVideoLink, tm)
            .then((res) => {
                if (res.state == 0) {
                    var data = self.state.data;
                    res.data.rows.map((x, i) => {
                        data.push(x);
                    });
                    if (page < res.data.total) {
                        self.setState({
                            data: data,
                            page: res.data.page,
                            active: false
                        });
                    } else {
                        self.setState({
                            data: data,
                            page: res.data.page,
                            hasMoreItems: false,
                            active: false
                        });
                    }
                }

            });
    }
    handleScroll() {
        let { active, hasMoreItems, page } = this.state;
        let sTo = $(window).scrollTop();
        let loader = $('#loader');
        let load = loader.position().top - (loader.innerHeight() * 3);
        if (sTo >= load && !active && hasMoreItems) {
            this.setState({ active: true });
            this.ajaxQuery();
        }

    }
    render() {
        let { data, hasMoreItems, active } = this.state;
        let showloading = null;

        let items = [];
        data.map((x, i) => {
            let url = "/Show/Content?id=" + x.video_id;
            items.push(
                <figure key={`${i}-${x.video_id}`} className="news-list">
                    <div className="cut">
                        <div dangerouslySetInnerHTML={{ __html: x.url }} />
                    </div>
                    <a href={url}></a>
                    <figcaption className="text-left">
                        <h4>{x.title}</h4>
                        <p>{x.context}</p>
                        <footer className="font-sm clearfix mt-8">
                            <span className="date pull-left">{moment(x.day).format("YYYY-MM-DD")}</span>
                            <a href={url} className="more pull-right">More</a>
                        </footer>
                    </figcaption>
                </figure>
            );
        });

        if (!hasMoreItems)
            showloading = { visibility: 'hidden' };

        return <div className="warp">
            {items}
            <div id="loader" className="loader loader--style3" title="2" style={showloading}>

                <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 50 50" style={{ 'enableBackground': 'new 0 0 50 50' }} xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                        <animateTransform attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="0.6s"
                            repeatCount="indefinite" />
                    </path>
                </svg>

            </div>
        </div >;
    }
}

var dom = document.getElementById('reactroot');
render(<VideoLink />, dom);