const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    invoiceNumber: {
        type: Number, required: true, unique: true
    },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    reciever: { type: Object, required: true },
    status: { type: String, required: true },
})
module.exports = mongoose.model('invoice_details', invoiceSchema);