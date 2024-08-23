const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    title:String,
    desc:String,
    img:String,
    ldesc:String,
    status:String,
    postedDate:Date,
})

module.exports = mongoose.model('service',serviceSchema)