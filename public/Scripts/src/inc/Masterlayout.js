"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
const update = require("react-addons-update");
const ac_set_1 = require("./ac_set");
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
        $('#nav_' + pp.menudata[i].menu_id).slideToggle();
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
                $('#nav_' + item.menu_id).slideUp();
            }
        });
    }
    clkNavItem(i, m, e) {
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
            React.createElement("main", { id: "main" },
                React.createElement("aside", { id: "sidebar" },
                    React.createElement("h6", { className: "oi", "data-glyph": "menu" }, "\u529F\u80FD\u9078\u55AE MENU"),
                    pp.menudata.map((item, i) => {
                        return [
                            React.createElement("header", { key: 'header_' + item.menu_id, className: item.use ? 'collapse-toggle active oi' : 'collapse-toggle oi', "data-glyph": item.icon_class, onClick: this.clkNav.bind(this, i) }, item.menu_name),
                            React.createElement("nav", { key: 'nav_' + item.menu_id, id: 'nav_' + item.menu_id, className: item.use ? 'collapse-content in' : 'collapse-content' }, item.sub.map((list, m) => {
                                return React.createElement("a", { key: 'link_' + list.menu_id, href: gb_approot + list.area + '/' + list.controller + '/' + list.action + '?menu_id=' + list.menu_id, onClick: this.clkNavItem.bind(this, i, m), className: list.use ? 'active' : '' },
                                    React.createElement("i", { className: "oi", "data-glyph": list.icon_class }),
                                    " ",
                                    list.menu_name);
                            }))
                        ];
                    })),
                React.createElement("div", { id: "content", className: "font-md" },
                    React.createElement("ul", { className: "breadcrumb" },
                        React.createElement("li", null, m1_name),
                        React.createElement("li", null,
                            "\u276F ",
                            m2_name)),
                    this.props.children)));
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
