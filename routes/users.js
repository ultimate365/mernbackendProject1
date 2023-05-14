const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const multer = require('multer')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var jwtAuth = (req, res, next) => {
    var token = req.headers.authorization;
    token = token.split(' ')[1];
    jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
        if (err) {
            res.send({ meassage: 'Invalid Token' })
        } else {
            next();
        }
    })
}

var passport = require('passport');
require('../config/passport')(passport);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })


router.get('/', (req, res) => {
    res.send('Hello Code Improved.');
})
router.get('/list', jwtAuth, userCtrl.userList);
// router.get('/list', passport.authenticate('jwt', { session: false }), userCtrl.userList);
// router.post('/list', userCtrl.userList);

router.post('/add', upload.single('myFile'), userCtrl.userAdd);

router.post('/login', userCtrl.userlogin);

router.post('/email-send', userCtrl.emailSend);
router.post('/change-password', userCtrl.changePassword);

module.exports = router;