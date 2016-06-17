var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Zipcode = require('../models/zip.js');
var request = require("request");
var NYT_Key = process.env.NYT_KEY

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
		console.log("Yippee kiyay motherfucker.");
		res.send(true);
	});
});


//====================================
// routes that require authentication
//====================================

// router.use(passport.authenticate('jwt', { session: false }));


router.get("/:id", function(req, res, next) {
	User.findById(req.params.id).then(function(user) {
		res.json(user.zipcodes)
	});
});


// NYTimes
router.get("/news/:topic", function(req, res){
	console.log("Starting.");
	var options = {
		"url": "https://api.nytimes.com/svc/topstories/v2/" + req.params.topic + ".json",
		qs: {
			"api-key": process.env.NYT_KEY}
	 };
	 request(options, function(err, response, body) {
	 	console.log(body);
	});
});

// Weather
router.get("/weather/:zip", function(req, res) {
    var zip = req.params.zip;
		// request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us" + "&units=metric" + "&appid=" + process.env.APIKEY, function (error, response, body) {   
    request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us" + "&units=imperial" + "&appid=" + process.env.APIKEY, function (error, response, body) {
        var response_data;
        console.log(body);
    if (!error && response.statusCode == 200) {
      var weatherData = JSON.parse(body);
      res.json(weatherData);
      // res.render("show.ejs", {weatherData});
    };
    });
});

module.exports = router;