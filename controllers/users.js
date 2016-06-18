//==============
// requirements
//==============

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

// router.use(passport.authenticate('jwt', { session: false }));        //commented out for testing purposes. will be commented back in later. or it should be, anyway.


//=====================
// add a new zip code
//=====================
router.post("/", function(req, res) {
  console.log(req.body);
  var zipcode = new Zipcode(req.body);
  zipcode.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Added new zip.");
    };
  });
});


//==================================
// get all the zip codes for a user
//==================================
router.get("/:id", function(req, res, next) {                   //we might not even need this, but it's good to have
	User.findById(req.params.id).then(function(user) {
		res.json(user.zipcodes);
	});
});

//==================================
// delete a zip code
//==================================
router.delete("/:id", function(req, res) {
  Zipcode.findByIdAndRemove(req.params.id, function() {
    console.log("Deleted.");
  });
});

//========================
// new york times request
//========================

router.get('/news/:topic', function(req, res){
	console.log("Starting.");
	var options = {
		'url': 'https://api.nytimes.com/svc/topstories/v2/' + req.params.topic + '.json',
		qs: {
			'api-key': process.env.NYT_KEY}
	 };
	 request(options, function(err, response, body) {
    var theData = []
	 	// console.log(body);
    var data = JSON.parse(body);
    console.log(typeof data);
    for(var i = 0; i < 5; i++){
      var dataObject = {
      'title': data.results[i].title,                        //so since you can't make multiple returns in server, have to come up with some way to put these all into an array of objects.
      'url': data.results[i].url,
      'data': data.results[i].abstract
      }
      theData.push(dataObject)
    }
    console.log(theData);
    res.send(theData);
	});
});

//==========================
// open weather api request
//==========================

router.get('/weather/:zip', function(req, res) {
    var zip = req.params.zip;
		// request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us" + "&units=metric" + "&appid=" + process.env.APIKEY, function (error, response, body) {   
    request('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us' + '&units=imperial' + '&appid=' + process.env.OPEN_WEATHER_ID, function (error, response, body) {
        var response_data;
        console.log(body);
      if (!error && response.statusCode == 200) {
        var weatherData = JSON.parse(body);
        res.json(weatherData);
      };
    });
});

module.exports = router;