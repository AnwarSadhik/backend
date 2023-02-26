const mongoose = require('mongoose')

const vendorSchema = mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    shopOwner: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    availableItem: {
        type: String,
    },
})

module.exports = mongoose.model('Vendor', vendorSchema)