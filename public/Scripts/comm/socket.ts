async function _makeSocket(url: string, protocol: string = null): Promise<WebSocket> {
    return new Promise<WebSocket>(function (resolve, reject) {
        var run = function () {
            //readyState
            //CONNECTING    0   The connection is not yet open.
            //OPEN          1   The connection is open and ready to communicate.
            //CLOSING       2   The connection is in the process of closing.
            //CLOSED        3 	The connection is closed or couldn't be opened.
            var ws: WebSocket;
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
                setTimeout(function () { run() }, 5000);
            };
            ws.onerror = function (e) {
                console.log('onerror', ws['ConnectionId'], e);
                reject(new Error('連線異常'));
            };
            ws.addEventListener('message', function (e) {
                var d = JSON.parse(e.data);
                if (d.type == 'ConnectionId') {
                    console.log('ConnectionId', d.id);
                    ws['ConnectionId'] = d.id
                    resolve(ws);
                }
            });

            ws.SendMsg = function (message) {
                ws.send(message);
            }
        }
        run();
    })
}

/**
 * 取得連結本站的websocket
 */
export default async function getWebsocket() {
    var path = getWSPath() + 'Ah/WS.ashx';
    //console.log('check path', path);
    return await _makeSocket(path);
}

function getWSPath() {
    var pl = location.protocol;

    var pr = pl === 'http:' ? 'ws' : 'wss';
    var pt = location.host;
    var rt = pr + '://' + pt + gb_approot;
    return rt;
}