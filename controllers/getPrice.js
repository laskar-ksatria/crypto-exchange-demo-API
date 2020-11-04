const axios = require('axios');

let url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTC,BCH&tsyms=USD'

function getCryptoPrice(cb) {
    axios({
        url,
        method: 'GET'
    })
    .then(({data}) => {
        cb(null,data);
    })
    .catch(err => cb(err, null))
};

module.exports = { getCryptoPrice };