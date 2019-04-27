
let userExist = function (res) {
    res.status(400);
    res.send({
        code: 400,
        message: 'User already exists'
    });
};

let userDoesNotExist = function (res) {
    res.status(404);
    res.send({
        code: 404,
        message: 'User does not exist'
    });
};

let serverError = function (res) {
    res.status(500);
    res.send({
        code: 500,
        message:'Server error'
    });
};

let tokenInvalid = function (res) {
    res.status(401);
    res.send({
        code: 401,
        auth: false,
        message: 'Token not valid'
    });
};

let passwordInvalid = function (res) {
    res.status(401);
    res.send({
        code: 401,
        auth: false,
        message: 'Password not valid'
    });
};


let tokenNotProvided = function (res) {
    res.status(400);
    res.status({
        code: 400,
        auth: false,
        message: 'No token provided.'
    });
};

var userNotCreated = function (res) {
    res.status(404);
    res.status({
        code: 404,
        message: "There was a problem registering the user`."
    });
};


module.exports = {
    userExist,
    userDoesNotExist,
    serverError,
    tokenInvalid,
    tokenNotProvided,
    userNotCreated,
    passwordInvalid

};
