var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var errorMessage = require('../errors');

// user for token validation in a request
var middleware = require('../middleware');

router.get('', )

router.post('/register', function(req, res) {

    // look up in the DB if the user exists already
    User.findOne({email: req.body.email}, function (error, user) {
        if (user) return res.status(400).send(errorMessage.userExist);
        if (error) return res.status(500).send(errorMessage.serverError);

        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        // no user exists -> create a new one
        User.create({
                name : req.body.name,
                email : req.body.email,
                password : hashedPassword
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem registering the user`.");

                // if user is registered without errors
                // create a token
                let token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send({ auth: true, token: token, email: req.body.email });
            });
        
    });


});

router.get('/getUser', middleware.checkToken, function (req, res) {

    let token = req.header['x-access-token'] || req.headers['authorization'];
    if (!token) return res.status(400).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({auth: false, message: 'Token not valid'});

        res.status(200).send(decoded);
    });
});

module.exports = router;