const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.HOST}:${process.env.DBPORT}/${process.env.DATABASE}`)
    .then(con => console.log('Connected To DB'))
    .catch(err => console.log('error', err))


module.exports = mongoose;