"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const ajax_1 = require("../../comm/ajax");
const api_1 = require("../../comm/api");
const moment = require("moment");
class VideoLink extends React.Component {
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
        };
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
        ajax_1.ft(api_1.default.GET__api_Utility_GetVideoLink, tm)
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
                }
                else {
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
            items.push(React.createElement("figure", { key: `${i}-${x.video_id}`, className: "news-list" },
                React.createElement("div", { className: "cut" },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: x.url } })),
                React.createElement("a", { href: url }),
                React.createElement("figcaption", { className: "text-left" },
                    React.createElement("h4", null, x.title),
                    React.createElement("p", null, x.context),
                    React.createElement("footer", { className: "font-sm clearfix mt-8" },
                        React.createElement("span", { className: "date pull-left" }, moment(x.day).format("YYYY-MM-DD")),
                        React.createElement("a", { href: url, className: "more pull-right" }, "More")))));
        });
        if (!hasMoreItems)
            showloading = { visibility: 'hidden' };
        return React.createElement("div", { className: "warp" },
            items,
            React.createElement("div", { id: "loader", className: "loader loader--style3", title: "2", style: showloading },
                React.createElement("svg", { version: "1.1", id: "loader-1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", width: "40px", height: "40px", viewBox: "0 0 50 50", style: { 'enableBackground': 'new 0 0 50 50' }, xmlSpace: "preserve" },
                    React.createElement("path", { fill: "#000", d: "M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" },
                        React.createElement("animateTransform", { attributeType: "xml", attributeName: "transform", type: "rotate", from: "0 25 25", to: "360 25 25", dur: "0.6s", repeatCount: "indefinite" })))));
    }
}
var dom = document.getElementById('reactroot');
react_dom_1.render(React.createElement(VideoLink, null), dom);
