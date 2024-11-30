const express = require('express');
const passport = require('passport');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/', passport.authenticate('local'), login);

module.exports = router;
