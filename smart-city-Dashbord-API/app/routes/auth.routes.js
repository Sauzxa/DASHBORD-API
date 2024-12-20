// /routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/authcontrollers/signUp.controller');
const { signIn } = require('../controllers/authcontrollers/signIn.controller');

router.post('/signup', signUp); // Sign up route
router.post('/signin', signIn); // Sign in route

module.exports = router;
