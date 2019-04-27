var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var errorHandler = require('../errorhandler');

// user for token validation in a request
var middleware = require('../middleware');

/*
    ------------------------------------
    API Endpoint for creating a new user
    ------------------------------------
*/

router.post('/register', function(req, res) {

    // look up in the DB if the user exists already
    User.findOne({email: req.body.email}, function (error, user) {
        if (user) return errorHandler.userExist(res);
        if (error) return errorHandler.serverError(res);

        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        // no user exists -> create a new one
        User.create({
                name : req.body.name,
                email : req.body.email,
                password : hashedPassword
            },
            function (err, user) {
                if (err) return errorHandler.userNotCreated(res);

                // if user is registered without errors
                // create a token
                let token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send({ auth: true, token: token, email: req.body.email });
            });
        
    });

});

/*
    ------------------------------------
    API Endpoint for logging in
    ------------------------------------
*/


router.post('/login', function (req, res) {

    // check if the user exists
    User.findOne({email: req.body.email}, function (error, user) {
        if (error) return errorHandler.serverError(res);
        if (!user) return errorHandler.userDoesNotExist(res);

        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return errorHandler.passwordInvalid(res);

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });

    });


});

/*
    ------------------------------------
    API Endpoint for logging out
    ------------------------------------
*/

router.post('/logout', middleware.checkToken, function (req, res) {
    // removing token will be implemented on a client side
    res.status(200).send({ code: 200, message: "Successfully logged out"});
});

/*
    -------------------------------------
    API Endpoint for getting user details
    -------------------------------------
*/

router.get('/getUser', middleware.checkToken, function (req, res) {

    // check if the user exists
    User.findById(req.decoded.id, function (error, user) {
        if (error) return errorHandler.serverError(res);
        if (!user) return errorHandler.userDoesNotExist(res);

        res.status(200).send(user);

    });
});

module.exports = router;