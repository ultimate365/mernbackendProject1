const mongoose = require('mongoose');
const conn = require('../config/db');

let otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresIn: Number
}, {
    timestamps: true
}
)

let otp = conn.model('otp', otpSchema, 'otp')

module.exports = otp;