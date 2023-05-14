const mongoose = require('mongoose');

var uri = `mongodb://maidul365:${process.env.PASSWORD}@ac-6spwm0o-shard-00-00.julotqr.mongodb.net:27017,ac-6spwm0o-shard-00-01.julotqr.mongodb.net:27017,ac-6spwm0o-shard-00-02.julotqr.mongodb.net:27017/${process.env.DATABASE}?ssl=true&replicaSet=atlas-4uf94d-shard-0&authSource=admin&retryWrites=true&w=majority`;



mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(con => console.log('Connected To DB'))
    .catch(err => console.log('error', err))


module.exports = mongoose;


