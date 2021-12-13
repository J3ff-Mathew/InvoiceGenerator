const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyAddress: { type: String, required: true },
    companyName: { type: String, required: true },
    imgPath: { type: String, required: true },

})
module.exports = mongoose.model("user_details", userSchema)
