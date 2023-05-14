const Users = require('../models/users')
var bcrypt = require('bcryptjs');
let Otp = require('../models/otp');
const { use } = require('passport');




const userList = async (req, res) => {
    // var responseType = {
    //     message: 'ok'
    // }
    // responseType.data = data;
    // let data = req.user
    // console.log(data)
    // res.status(200).json({ message: 'ok', data: responseType });
    try {
        let data = await Users.find();
        res.json(data);
    } catch (e) {
        res.status(301).json({ message: 'error', message: "Something Went Wrong" });
    }
}

const userAdd = async (req, res) => {
    let profile = (req.file) ? req.file.filename : null;
    let { name, email, phone, password } = req.body;
    let data = await new Users({ name, email, phone, profile, password })
    try {
        let response = await data.save();
        let myToken = await data.getAuthToken();
        res.status(200).json({ message: 'ok', token: myToken });
    } catch (e) {
        res.status(301).json({ message: 'error', message: "Something Went Wrong" });
    }
}

const userlogin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(301).json({ message: 'error', message: "Please Select Email/Password" });
    }
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        var match = bcrypt.compare(req.body.password, user.password)
        var responseType = {
            message: 'ok'
        }
        if (match) {
            try {
                let myToken = await user.getAuthToken();
                responseType.message = 'Login Successfully';
                responseType.token = myToken;
                responseType.id = user._id;
                // res.status(200).json({ message: 'Login Successfully' });
            } catch (e) {
                res.status(301).json({ message: 'error', message: "Something Went Wrong" });
            }
        }
        else {
            responseType.message = "Invalid Password";
            // res.status(301).json({ message: 'error', message: "Invalid Password" });
        }

    }
    else {
        responseType.message = "Invalid Email ID";
    }
    // console.log(user);
    res.status(200).json({ message: 'ok', data: responseType });
}


const emailSend = async (req, res) => {
    let rEmail = req.body.email;
    let data = await Users.findOne({ email: rEmail });
    const responseType = {};
    let otpcode = Math.floor((Math.random() * 10000) + 1)
    if (data) {
        let otpdata = new Otp({
            email: req.body.email,
            code: otpcode,
            expiresIn: new Date().getTime() + 300 * 1000
        })
        let otpResponse = await otpdata.save();
        responseType.statusText = 'Success'
        // responseType.otp = otpcode
        responseType.message = 'OTP Sent, Please check your Email'
        // mailer(rEmail, otpcode)
    } else {
        responseType.statusText = 'Error'
        responseType.message = 'Email does not Exist'
    }
    res.status(200).json(responseType)
    console.log(otpcode)

}

const changePassword = async (req, res) => {
    let data = await Otp.find({ email: req.body.email, code: req.body.code });
    console.log(req.body.email)
    const responseType = {};
    if (data) {
        let currentTime = new Date().getTime();
        let difference = data.expiresIn - currentTime;
        if (difference < 0) {
            responseType.message = 'Token Expired';
            responseType.statusText = 'error';
        } else {
            let user = await Users.findOne({ email: req.body.email });
            user.password = req.body.password;
            user.save();
            responseType.message = 'Password Changed Successfully';
            responseType.statusText = 'Success';
        }
    } else {
        responseType.message = 'Invalid OTP';
        responseType.statusText = 'error';
    }
    res.status(200).json(responseType);
    console.log(responseType)

}

const mailer = (email, otp) => {
    const nodemailer = require("nodemailer");
    var smtpTransport = require('nodemailer-smtp-transport');
    // let transporter = nodemailer.createTransport({
    //     service: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'maidul365@gmail.com',
    //         pass: 'qfiznzdfuhwvarrs'
    //     }
    // });
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'maidul365@gmail.com',
            pass: 'qfiznzdfuhwvarrs'
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    let mailoptions = {
        from: 'maidul365@gmail.com',
        to: email,
        subject: `Reset your Password: Mail no ${Math.floor((Math.random() * 100) + 1)}`,
        text: `Your OTP is ${otp}`
    }
    transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email Sent: ' + info.response);
        }
    });
}

module.exports = {
    userList,
    userAdd,
    userlogin,
    emailSend,
    changePassword
};