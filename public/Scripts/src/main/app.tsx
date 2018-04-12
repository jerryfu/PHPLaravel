import React = require('react');
import update = require('react-addons-update');
import { connect } from 'react-redux';
import { AddMasterMenu } from '../inc/addMaster'
import { menudata } from '../inc/reducers';
import cbnReduce from '../inc/cbnReduce'
import pk from '../../comm/param_key';
import { pv } from '../../comm/comm-func';

//沒有預設畫面 進行導入
declare var role: string;
if (role == 'A') {
    document.location.href = gb_approot + pv(pk.FirstLoginPageUser);
} else {
    document.location.href = gb_approot + pv(pk.FirstLoginPageUser);
}


interface GridProps {
    edit_type?: IEditType
}

class Grid extends React.Component<GridProps, any>{

    constructor() {
        super();
        this.state = {};
    }

    render() {
        let out_html: JSX.Element = <div>
            <h3 className="title">ViewBag.Crumb <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list">
                <dl className="fields">
                    <dt className="col-1">發佈日期</dt>
                    <dd className="col-5">
                        <input className="form-element" required type="date" />
                    </dd>
                </dl>
                <dl className="fields">
                    <dt className="col-1">標題</dt>
                    <dd className="col-5">
                        <input className="form-element" type="text" />
                    </dd>
                </dl>
                <dl className="fields">
                    <dt className="col-1">前台顯示</dt>
                    <dd className="col-5">
                        <input id="show1" name="show" defaultChecked type="radio" />
                        <label htmlFor="show1" />顯示
              <input id="show2" name="show" type="radio" />
                        <label htmlFor="show2" />隱藏
            </dd>
                </dl>
                <dl className="fields">
                    <dt className="col-1">排序</dt>
                    <dd className="col-5">
                        <input defaultValue={'0'} className="form-element inline" type="number" />
                        <small>數字愈大愈前面</small>
                    </dd>
                </dl>
                <dl className="fields">
                    <dt className="col-1">消息內容</dt>
                    <dd className="col-11">
                        <div className="alert-warning m-b-16">
                            <strong>編輯器注意事項:</strong><br />
                            從 WORD 複製文字時，請使用下方的 <img src="/Content/images/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版<br />
                            編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br />
                            檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明) <br />
                            youtube 可勾選「用自適應縮放模式」
              </div>
                        <textarea className="form-element" defaultValue={""} />
                    </dd>
                </dl>
                <footer className="submit-bar clear m-t-24">
                    <button type="button" className="btn success oi" data-glyph="circle-check">
                        確認儲存
            </button>
                    <button type="button" className="btn warning oi" data-glyph="circle-x">
                        回列表
            </button>
                </footer>
            </form>
        </div>;
        return out_html;
    }
}

const ComToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    }
}
const ComDispatch = (dispatch, ownProps) => {
    return {
    }
}
let GridView = connect<{}, {}, {}>(ComToProps, ComDispatch)(Grid)

const store = cbnReduce({ menudata });
//AddMasterMenu(GridView, store, gb_menu_id);