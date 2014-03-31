var net = require('net');

var Server = net.Server.prototype;
var Pipe = process.binding('pipe_wrap').Pipe;

var oldListen = Server.listen;
Server.listen = function () {
    var self = this;

    if (arguments.length >= 1 && arguments[0] === 'systemd') {
        if (!process.env.LISTEN_FDS || parseInt(process.env.LISTEN_FDS, 10) !== 1) {
            throw(new Error('No or too many file descriptors received.'));
        }

        if (!process.env.LISTEN_PID || parseInt(process.env.LISTEN_PID, 10) !== process.pid) {
            throw(new Error('LISTEN_PID missing or wrong.'));
        }

        arguments[0] = { fd: 3 };
        oldListen.apply(self, arguments);
    } else {
        oldListen.apply(self, arguments);
    }
    return self;
};
