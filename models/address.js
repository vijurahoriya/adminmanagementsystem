const mongoose  = require('mongoose');

const addressSchema = mongoose.Schema({
    address : String,
    mobile : String,
    phone : String,
})

module.exports = mongoose.model('address',addressSchema)