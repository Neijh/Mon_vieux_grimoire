// User routing logic

const express = require('express');
const router = express.Router(); // Save routes in Express router
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // Register a new user
router.post('/login', userCtrl.login); // Login a registered user

module.exports = router;