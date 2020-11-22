const websocket = require('ws');

let cryptocompareWS = new websocket("wss://streaming.cryptocompare.com");

let subs = {
    "action": "SubAdd",
    "subs": ["30~bitfinex~BTC~USD"],

    "format": "streamer"
 }


 cryptocompareWS.on('open', function(){
    console.log('connection established');
    cryptocompareWS.send(JSON.stringify(subs));
});

cryptocompareWS.on('close', function(){
    console.log('disconnected');
});

cryptocompareWS.on('message', function(data) {
    if (data === '999~HEARTBEAT|') {
        console.log(data);
        return;
    }
    let updates = data.split('|');
    updates.pop(); //Remove last element as it is always an empty string
    for (let update of updates) {
        let parsedUpdate = parseLevel1(update);
        console.log(JSON.stringify(parsedUpdate))
    }
})