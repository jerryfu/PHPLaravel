"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function _makeSocket(url, protocol = null) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            var run = function () {
                var ws;
                if (protocol)
                    ws = new WebSocket(url, protocol);
                else
                    ws = new WebSocket(url);
                ws['ConnectionId'] = null;
                ws.onopen = function (e) {
                    console.log('onopen', ws['ConnectionId'], ws.readyState);
                };
                ws.onclose = function (e) {
                    console.log('onclose', ws['ConnectionId'], e);
                    setTimeout(function () { run(); }, 5000);
                };
                ws.onerror = function (e) {
                    console.log('onerror', ws['ConnectionId'], e);
                    reject(new Error('連線異常'));
                };
                ws.addEventListener('message', function (e) {
                    var d = JSON.parse(e.data);
                    if (d.type == 'ConnectionId') {
                        console.log('ConnectionId', d.id);
                        ws['ConnectionId'] = d.id;
                        resolve(ws);
                    }
                });
                ws.SendMsg = function (message) {
                    ws.send(message);
                };
            };
            run();
        });
    });
}
function getWebsocket() {
    return __awaiter(this, void 0, void 0, function* () {
        var path = getWSPath() + 'Ah/WS.ashx';
        return yield _makeSocket(path);
    });
}
exports.default = getWebsocket;
function getWSPath() {
    var pl = location.protocol;
    var pr = pl === 'http:' ? 'ws' : 'wss';
    var pt = location.host;
    var rt = pr + '://' + pt + gb_approot;
    return rt;
}
