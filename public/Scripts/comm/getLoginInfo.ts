import { fetchGet } from './ajax';

export async function callLoginInfo(en_login_id: string) {
    let result = await fetchGet<ReturnData<LoginInfo>>(gb_approot + 'Index/LoginInfo', { en_login_id: en_login_id });
    if (result.state == 0) {
        login_info = result.data;
        login_info.enUrlCustId = encodeURIComponent(result.data.en_cust_id);
    }
}