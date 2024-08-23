const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
   img:String,
   quote:String,
   company:String,
   status:String,
   postedDate:Date,
}) 

module.exports = mongoose.model('testi',testSchema)