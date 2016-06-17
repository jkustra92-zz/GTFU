var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var jwt = require('jsonwebtoken');

// Initialize passport
router.use(passport.initialize());

// Log in and if successful, send back the token
router.post('/', passport.authenticate('local', { session: false }), function(req, res, next) {
	// console.log('••••••••••••••••••••••');
	// console.log('LOG IN AS ' + req.user.username );
	// console.log('••••••••••••••••••••••');

	// Maybe don't sign with entire user
	var token = jwt.sign(req.user, process.env.JWT_SECRET, {
		expiresIn: 1440 // Expires in 24 hours
	});
	// console.log(token);
	res.send({ token: token });
});

module.exports = router;