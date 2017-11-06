const config = require('../config')

const mongoose = require('mongoose')
// mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'))
mongoose.connect(config.get('mongoose:uri'), { useMongoClient: true })

module.exports = mongoose
