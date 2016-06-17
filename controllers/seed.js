var express = require('express');
var mongoose = require('mongoose');
var db = process.env.MONGODB_URI || "mongodb://localhost/gtfo";
var router = express.Router();
var User = require('../models/users.js');
var Zipcode = require('../models/zip.js');

router.get('/', function(req, res) {

	var user1 = new User({
	  username: "squad",
	  email: "squad@fam.com",
	  password: "password",
	});

	var zipcode1 = new Zipcode({
		zipcode: 10010
	});

	var zipcode2 = new Zipcode({
		zipcode: 11103
	});

	user1.save();
	zipcode1.save();
	zipcode2.save();
	user1.zipcodes.push(zipcode1);
	user1.zipcodes.push(zipcode2);
	user1.save();
	console.log("=========")
	console.log("it done")
	console.log("=========")
	res.end();
});

module.exports = router;