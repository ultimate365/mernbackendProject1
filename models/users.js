const mongoose = require('mongoose');
const conn = require('../config/db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phone: String,
    profile: String,
    password: {
        type: String,
        select: true
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ]
}, {
    timestamps: true
}
)

userSchema.pre('save', function (next) {
    var salt = bcrypt.genSaltSync(10);
    if (this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
})

userSchema.methods.getAuthToken = async function (data) {
    let params = {
        id: this._id,
        email: this.email,
        phone: this.phone,
    }
    var tokenvalue = jwt.sign(params, process.env.SECRETKEY, { expiresIn: '300000s' });
    this.tokens = this.tokens.concat({ token: tokenvalue });
    await this.save();
    return tokenvalue;
}


let users = conn.model('users', userSchema);
module.exports = users;