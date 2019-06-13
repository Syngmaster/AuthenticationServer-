const express = require('express');
let app = express();
const db = require('./db');
var cookieParser = require('cookie-parser');

let authController = require('./auth/AuthController');
app.use('/api/auth', authController);
app.use(cookieParser());

module.exports = app;