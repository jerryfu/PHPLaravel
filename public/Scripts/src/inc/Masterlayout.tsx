import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import update = require('react-addons-update');
import { ac } from './ac_set';
interface MasterMenuProps {
    menudata?: Array<server.Menu>
    collapseMenu?: Function
}

class MasterMenu extends React.Component<MasterMenuProps, any>{

    constructor() {
        super();
        this.clkNav = this.clkNav.bind(this);
        this.clkNavItem = this.clkNavItem.bind(this);
        this.state = {
        };
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
            } else {
                struct[j] = {
                    use: { $set: false }
                }
                $('#nav_' + item.menu_id).slideUp();
            }
        })
        //let n_state = update(this.props.menudata, struct);
        //pp.collapseMenu(n_state);
    }
    clkNavItem(i, m, e) {
        //alert(1)
        let pp = this.props;
        let value = true;
        let struct = { [i]: { sub: {} } };
        pp.menudata[i].sub.forEach((item, j) => {
            if (m == j) {
                struct[i].sub[j] = {
                    use: { $set: value }
                }
            } else {
                struct[i].sub[j] = {
                    use: { $set: false }
                }
            }
        })
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

        return <div>
            <main id="main">
                <aside id="sidebar">
                    <h6 className="oi" data-glyph="menu">功能選單 MENU</h6>
                    {
                        pp.menudata.map((item, i) => {
                            return [
                                <header key={'header_' + item.menu_id} className={item.use ? 'collapse-toggle active oi' : 'collapse-toggle oi'}
                                    data-glyph={item.icon_class}
                                    onClick={this.clkNav.bind(this, i)}>
                                    {item.menu_name}
                                </header>,
                                <nav key={'nav_' + item.menu_id}
                                    id={'nav_' + item.menu_id}
                                    className={item.use ? 'collapse-content in' : 'collapse-content'}>
                                    {
                                        item.sub.map((list, m) => {
                                            return <a key={'link_' + list.menu_id}
                                                href={gb_approot + list.area + '/' + list.controller + '/' + list.action + '?menu_id=' + list.menu_id}
                                                onClick={this.clkNavItem.bind(this, i, m)} className={list.use ? 'active' : ''}>
                                                <i className="oi" data-glyph={list.icon_class}></i> {list.menu_name}
                                            </a>
                                        })
                                    }
                                </nav>
                            ];
                        })
                    }
                </aside>
                <div id="content" className="font-md">
                    <ul className="breadcrumb">
                        {/*麵包屑*/}
                        <li>{m1_name}</li>
                        <li>❯ {m2_name}</li>

                    </ul>

                    {/*內容版面*/}
                    {this.props.children}
                </div>
            </main>
        </div>
    }
}

const collapseMenu = (data) => {
    return {
        type: ac.collapse_menu,
        data
    }
}

interface MasterMenuState {
    menudata: Array<server.Menu>
}
export default connect<{}, {}, {}>(
    state => ({
        menudata: state.menudata
    }),
    (dispatch, ownProps) => bindActionCreators({
        collapseMenu
    }, dispatch))
    (MasterMenu)

