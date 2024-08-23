const mongoose = require('mongoose');

const adminregSchema = mongoose.Schema({
    username:String,
    password:String,
})

module.exports = mongoose.model('adminreg',adminregSchema)