import { isOK } from '../../comm/comm-func';

export function sumCdn(n, active) {
    if (isOK(n) && active)
        return n;
    else
        return 0;
}
function setSource(Y3, Y2, YP) {

    if (!isOK(Y3) && !isOK(Y2) && !isOK(YP))
        return -1; //代表不用計算 清空

    let n1 = isOK(Y3) ? Y3 : 0;
    let n2 = isOK(Y2) ? Y2 : 0;
    let n3 = isOK(YP) ? YP : 0;

    let n = n1 * 3 + n2 * 2 + n3 * 1;
    return n;
}
export function fmtSource(Y3, Y2, YP) {
    let rlt = setSource(Y3, Y2, YP);
    if (rlt == -1)
        return '-';
    else
        return rlt.toString();
}
export function sumSource(Y3, Y2, YP) {
    let rlt = setSource(Y3, Y2, YP);
    if (rlt == -1)
        return 0;
    else
        return rlt;
}
