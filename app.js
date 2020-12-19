if (process.NODE_ENV === 'development' || !process.NODE_ENV === 'development') {
};
require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const PORT = process.env.PORT;
const socket = require('socket.io');

//db Connect
require('./db.connect')();

//Socketio
let Io = socket(server)

//app use
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req,res,next) => {
    req.Io = Io;
    next();
})

app.use(require('./routes'));
app.use(require('./middlewares/errHandler'));

//Websocket
const WebSocket = require('ws');

const apiKey = process.env.API_KEY

const ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey);

function walkingWithWebSocket() {
    ccStreamer.on('open', function open() {
        var subRequest = {
            "action": "SubAdd",
            "subs": ["2~Coinbase~BTC~USD", "2~Coinbase~LTC~USD", "2~Coinbase~ETH~USD", "2~Coinbase~BCH~USD"]
        };
        ccStreamer.send(JSON.stringify(subRequest));
    });
    ccStreamer.on('message', function incoming(data) {
        let { PRICE, FROMSYMBOL, TOSYMBOL, VOLUME24HOUR } = JSON.parse(data);
        if (PRICE && FROMSYMBOL && TOSYMBOL && VOLUME24HOUR) {
            Io.emit(`realtime-price`, {PRICE, FROMSYMBOL, TOSYMBOL, VOLUME24HOUR});
        }
    });
};

walkingWithWebSocket();

server.listen(PORT, () => console.log(`Server started on ${PORT}`));

Io.on('connection', socket => {
    socket.on('disconnect', () => {})
})


