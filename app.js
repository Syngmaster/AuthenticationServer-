const express = require('express');
let app = express();
const db = require('./db');

let authController = require('./auth/AuthController');
app.use('/api/auth', authController);

module.exports = app;