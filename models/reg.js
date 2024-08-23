const mongoose = require('mongoose');

const regSchema = mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    email:String,
    image:String,
    status:String,
    roles:String,
})

module.exports = mongoose.model('reg',regSchema);