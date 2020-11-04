const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const dbConnect = () => {
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('We are connected to mongoose')
    });
};

module.exports = dbConnect;



