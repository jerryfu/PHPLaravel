"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
const update = require("react-addons-update");
const ac_set_1 = require("../inc/ac_set");
class MasterMenu extends React.Component {
    constructor() {
        super();
        this.clkNav = this.clkNav.bind(this);
        this.clkNavItem = this.clkNavItem.bind(this);
        this.state = {};
    }
    clkNav(i, e) {
        let pp = this.props;
        let value = !pp.menudata[i].use;
        let struct = {};
        pp.menudata.forEach((item, j) => {
            if (i == j) {
                struct[j] = {
                    use: { $set: value }
                };
            }
            else {
                struct[j] = {
                    use: { $set: false }
                };
            }
        });
        let n_state = update(this.props.menudata, struct);
        pp.collapseMenu(n_state);
    }
    clkNavItem(i, m, e) {
        alert('menu1');
        let pp = this.props;
        let value = true;
        let struct = { [i]: { sub: {} } };
        pp.menudata[i].sub.forEach((item, j) => {
            if (m == j) {
                struct[i].sub[j] = {
                    use: { $set: value }
                };
            }
            else {
                struct[i].sub[j] = {
                    use: { $set: false }
                };
            }
        });
        let n_state = update(this.props.menudata, struct);
        pp.collapseMenu(n_state);
    }
    render() {
        let pp = this.props;
        if (!pp.menudata)
            return null;
        let m1 = pp.menudata.filter(x => x.use == true);
        let m2 = m1 && m1.length > 0 ? m1[0].sub.filter(x => x.use == true) : null;
        let m1_name = m1 && m1.length > 0 ? m1[0].menu_name : null;
        let m2_name = m2 && m2.length > 0 ? m2[0].menu_name : "No";
        return React.createElement("div", null,
            React.createElement("header", { id: "header" },
                React.createElement("h1", { className: "site-title" }, "\u9433\u63DA\u5275\u667A\u7BA1\u7406\u7CFB\u7D71"),
                React.createElement("nav", { className: "navbar" },
                    React.createElement("span", { className: "nav-link" }, "\u767B\u5165\u8EAB\u4EFD: \u7BA1\u7406\u8005"),
                    React.createElement("a", { href: "~/index", className: "nav-link oi home", "data-glyph": "home" }, "\u56DE\u9996\u9801"),
                    React.createElement("a", { href: "~/Login/Logout", className: "nav-link oi logout", "data-glyph": "power-standby" }, "\u767B\u51FA"))),
            React.createElement("main", { id: "main" },
                React.createElement("div", { id: "content", className: "font-md" },
                    React.createElement("ul", { className: "breadcrumb" },
                        React.createElement("li", null, m1_name),
                        React.createElement("li", null,
                            "\u276F ",
                            m2_name),
                        this.props.children)),
                React.createElement("aside", { id: "sidebar" },
                    React.createElement("h6", { className: "oi", "data-glyph": "menu" }, "\u529F\u80FD\u9078\u55AE MENU"),
                    pp.menudata.map((item, i) => {
                        return [
                            React.createElement("header", { key: 'header_' + item.menu_id, className: item.use ? 'collapse-toggle in active' : 'collapse-toggle in', "data-glyph": item.icon_class, onClick: this.clkNav.bind(this, i) }, item.menu_name),
                            React.createElement("nav", { key: 'nav_' + item.menu_id, className: item.use ? 'collapse-content in' : 'collapse-content', style: { display: item.use ? 'block' : 'none' } }, item.sub.map((list, m) => {
                                return React.createElement("a", { key: 'link_' + list.menu_id, href: gb_approot + list.area + '/' + list.controller + '/' + list.action + '?menu_id=' + list.menu_id }, list.menu_name);
                            }))
                        ];
                    }))));
    }
}
const collapseMenu = (data) => {
    return {
        type: ac_set_1.ac.collapse_menu,
        data
    };
};
exports.default = react_redux_1.connect(state => ({
    menudata: state.menudata
}), (dispatch, ownProps) => redux_1.bindActionCreators({
    collapseMenu
}, dispatch))(MasterMenu);
