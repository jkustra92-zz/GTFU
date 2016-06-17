var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Zipcode = require('../models/zip.js');


//==========================================
// routes that don't require authentication
//==========================================

//=================== 
// create a new user
//===================

router.post('/', function(req, res) {
	User.create(req.body, function(err, user) {
		if(err) {
			console.log(err); 
			res.status(500).end();
		}
		res.send(true);
	});
});

//====================================
// routes that require authentication
//====================================

router.use(passport.authenticate('jwt', { session: false }));


router.get("/:id", function(req, res, next) {
	User.findById(req.params.id).then(function(user) {
		res.json(user.zipcodes)
	});
});

module.exports = router;