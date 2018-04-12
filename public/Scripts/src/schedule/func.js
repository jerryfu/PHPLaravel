"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comm_func_1 = require("../../comm/comm-func");
function sumCdn(n, active) {
    if (comm_func_1.isOK(n) && active)
        return n;
    else
        return 0;
}
exports.sumCdn = sumCdn;
function setSource(Y3, Y2, YP) {
    if (!comm_func_1.isOK(Y3) && !comm_func_1.isOK(Y2) && !comm_func_1.isOK(YP))
        return -1;
    let n1 = comm_func_1.isOK(Y3) ? Y3 : 0;
    let n2 = comm_func_1.isOK(Y2) ? Y2 : 0;
    let n3 = comm_func_1.isOK(YP) ? YP : 0;
    let n = n1 * 3 + n2 * 2 + n3 * 1;
    return n;
}
function fmtSource(Y3, Y2, YP) {
    let rlt = setSource(Y3, Y2, YP);
    if (rlt == -1)
        return '-';
    else
        return rlt.toString();
}
exports.fmtSource = fmtSource;
function sumSource(Y3, Y2, YP) {
    let rlt = setSource(Y3, Y2, YP);
    if (rlt == -1)
        return 0;
    else
        return rlt;
}
exports.sumSource = sumSource;
