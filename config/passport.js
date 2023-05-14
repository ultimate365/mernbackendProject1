var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var Users = require('../models/users');
module.exports = function (passport) {
    let params = {
        secretOrKey: process.env.SECRETKEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };


    passport.use(
        new JWTStrategy(params, function (jwt_payload, next) {
            let emailId = jwt_payload.email;
            Users.findOne({ email: emailId }).then(function (err, user) {
                if (err) {
                    return next(err, false);
                }
                if (user) {
                    next(null, user)
                }
                else {
                    next(null, false)
                }
            });
        })
    )
}