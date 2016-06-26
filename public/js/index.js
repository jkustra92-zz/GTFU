// ========================
// the entire application
// ========================

var App = React.createClass({ 
	//checking for cookie
	//true otherwise cookie is an empty string
	getInitialState: function() {
		var cookieCheck;
		if(document.cookie) {
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			userId: '',
			authenticatedUser: cookieCheck
		};
	},
	//removing cookie and tempory cookies
	//and returning auth user 
	eatTheCookie: function() { 												// thanks Joe
		Cookies.remove('jwt_token');
		// Cookies.remove('temp');  
		console.log(this.state)
		this.setState({ //sets the auth user to an empty string
			authenticatedUser: '', //to check if the user is really logged in 
		});
	},

	//setting auth user to true to 
	//keep them logged in
	changeLogin: function(dataId) { //take the state and set the userid to data id and set the authuser to true
		this.setState({
			userId: dataId,
			authenticatedUser: true
		});
	},
	//renders the login form and the signup button
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		// console.log('cookie:', document.cookie); //renders users homepage if true
		if(this.state.authenticatedUser === true) {
			return ( //check the state if its true and re-render
				<Page userId = {this.state.userId} onChange={this.eatTheCookie} />									
			)	//page to have the state for weather and eat the cookie for logging out																																
		}else{
			return (
				<div id = 'homepage'>
					<div id="about">
						Grow The Fork Up is designed to help you become a better adult by  rendering the upcoming weather and the latest news from one of the world's top accredited news sites. 
    			</div>
    			<div className="icon-sun-shower">
      		<div className="cloud"></div>
      		<div className="sun">
      		<div className="rays"></div>
    		</div>
      <div className="rain"></div>
    </div>
					<LoginForm
						initialLoginCheck={this.state.authenticatedUser} //state that we set initially
						onChange={this.changeLogin}//on change resets that state //dont want state changin in too many palces
					/>
					<SignUpButton onChange={this.changeLogin}/>
				</div>
			);
		}
	}
});
//passing the above attributes down bc we want to be bale to access the state of the auth user and later change it upon login
// ======================
// login form component
// ======================
//setting state for component where it's relevant
var LoginForm = React.createClass({
	//username to be filled
	getInitialState: function() {
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck,
			userId: ""
		};
	},
	//whatever changes happen are applied
	handleLoginFormChange: function(stateName, e) {
		var change = {}; //its going to make an object out of what the user: email/password is
		change[stateName] = e.target.value;//change state name allows for both emal and passowrd fields to be changed
		this.setState(change);
	},
	handleSubmit: function(e) {
		//the user credentials are then saved 
		e.preventDefault();//prevent the default action of the form
		var username = this.state.username.trim();//get the username and pass word to the current state
		var password = this.state.password.trim();//.trim takesoffthewhitspace
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password) { //lines up to the username and password
		//ajax request to save the user creds  //post requezt
		$.ajax({
			url: '/auth',
			method: 'POST',
			data: {
				username: username,
				password: password //takes the usernme and password
			},
			//if saved it console logs
			success: function(data) { //when successful gives the token and username from above
				console.log('Token acquired.');
				console.log(data);
				Cookies.set('jwt_token', data.token);
				this.props.onChange(data.id) //this.props.onchange is reffering to the login functionallity thats been passed down
			}.bind(this),//sets the state of the authenticated user to true and userid equal to data id, set bc of ajax request
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	//rendering the login form itself
	render: function() {
		return (
			<div className='login-form'>
				<h3>Forking Login</h3> 
				<form onSubmit={this.handleSubmit}>  
					<input
						className='username-login-form'
						type='text' 
						placeholder='username'
						value={this.state.username} //is set as the initial login check, it doesnt equal anything
						onChange={this.handleLoginFormChange.bind(this, 'username')} //bind makes sure that 'this' calls upon the data reffered
					/>
					<br/>
					<input
						className='password-login-form'
						type='password'
						placeholder='password'
						value={this.state.password}
						onChange={this.handleLoginFormChange.bind(this, 'password')} //
					/>
					<br/>
					<input type='submit' id='button' />
				</form>
			</div>
		)
	}
})

//=========================																	
// signup button component
//=========================

//sign up form, sets user to false
//when clicked it turns it to true,
//if false the sign up is rendered
var SignUpButton = React.createClass({
	getInitialState: function(){
	return ({clicked: false})
	},
	handleClick: function(){
		this.setState({clicked: true})
	},
	render: function() {
		if (this.state.clicked == false){
			return(
				<button
					id="sign-up-button"
					onClick = {this.handleClick}
				>
					Sign Up
				</button>
			)
		}else{
			return(
				<SignUpForm onChange={this.props.onChange}/>)
		}
	}
});

//========================
// sign up form component
//========================

//sign up form; empty strings to be filled
var SignUpForm = React.createClass({
	getInitialState: function() {
		return {
			username: '',
			email: '',
			password: ''
		}
	},
	handleSignupFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		console.log(change)
		this.setState(change);
	},
	//submits the user input
	//and saves it 
	handleSubmit: function(e) {
		e.preventDefault();
		console.log('WAT THE HELL');
		var username = this.state.username.trim();
		var email = this.state.email.trim();
		var password = this.state.password.trim();
		this.signupAJAX(username, email, password);
	},
	handleSignupAuthentication: function(username, password){
		var self = this;
		console.log(this.props.onChange);
		var callback = function(userId) {
			self.props.onChange(userId);
		};
			$.ajax({
				url: '/auth',
				method: 'POST',
				data: {
					username: username,
					password: password
				},
				//if saved it console logs
				success: function(data) {
					console.log('Token acquired.');
					console.log(data);
					Cookies.set('jwt_token', data.token);
					callback(data.id)
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(status, err.toString());
				}.bind(this)
			});
		//Set username from signupAJAX and password from signupAJAX to new variables
		//Use same ajax request from loginAJAX to authenticate user after succesfull signup.

	},
	signupAJAX: function(username, email, password) {
		$.ajax({
			url: '/users',
			method: 'POST',
			data: {
				username: username,
				email: email,
				password: password
			},
			success: function(data){
				//Pass username and password into this.handSignupAuthentication(username, password)
				console.log(data);
				this.handleSignupAuthentication(username, password);
			}.bind(this)
		})
	},
	//rendering sign up form
	render: function() {
		return(
			<div className='signup-form'>
				<h3>Sign The Fork Up</h3>
				<form onSubmit={this.handleSubmit}>
					<input
						className='username-signup-form'
						type='text'
						placeholder='username'
						value={this.state.username}
						onChange={this.handleSignupFormChange.bind(this, 'username')}
					/>
					<br/>
					<input
						className='email-signup-form'
						type='text'
						placeholder='email'
						value={this.state.email}
						onChange={this.handleSignupFormChange.bind(this, 'email')}
					/>
					<br/>
					<input
						className='password-signup-form'
						type='password'
						placeholder='password'
						value={this.state.password}
						onChange={this.handleSignupFormChange.bind(this, 'password')}
					/>
					<br/>
					<input type='submit' id='button' />
				</form>
			</div>
		);
	}
});


//=================
// WITH AUTH
//=================
//JUST RENDERS THE PAGE
//logging out 
var Page = React.createClass({
	render: function() {
		console.log(this.props.userId)
		return ( //this.props.change regers to the cookie userId is passed down to weather
			<div main-container> 
				<LogOut onChange={this.props.onChange} />
				<Weather userId = {this.props.userId} />
				<News />
			</div>
		);
	}
});
//logout renders button w/ this.handle click. calls on this.props.onchange, which is eat the cookie
var LogOut = React.createClass({
	handleClick: function() {
		console.log('WAT')
		console.log(this.props.onChange);
		this.props.onChange();
	}, //when button is clicked it will invoke the eat the cookie function and set the state and cause the page to re-render
	render: function() {
		console.log(this.props.onChange);
		return (
			<div>
				<button
					onClick={this.handleClick}
					id='logout-button'
					>
					Log Out
				</button>
			</div>
		);
	}	
});

//=================
// WEATHER
//=================

// //Using ajax, requests the api w/ 
// //entered zipcode

var Weather = React.createClass({
	getInitialState: function(){
		return (//empty state because nothing has happened
			{
				locations: null,
				currentWeather: null,
				zip: null
			}	
		)
	},
	//componentDidMount will run the function for the 
	//Ajax call to render the zipcodes upon loading.
	componentDidMount: function(){ //runs whatever the funtions inside of it ONE time, that way there is no infinite loop
		this.getUsersLocations(this.props.userId)
	},//upon rendering it will get the location and the users id to get all the zips from the users database
	getUsersLocations: function(userId){ //represents users location and queries the users locations from the db
		console.log(userId)
		$.ajax({
			url: "/users/" + userId,
			method: "GET",
			success: function(data) { //upon success it will set the state of locations to the zip codes it gets back
				console.log(data)
				this.setState({locations: data})
			}.bind(this)
		})
	},
	weatherAJAX: function(zipcode) {
		$.ajax({
			url: "/users/weather/" + zipcode, //hit a route in the controller 
			method: "GET",
			success: function(data) { 
				console.log(data)
				console.log(zipcode)
				this.setState({currentWeather: data, zip: zipcode}) //set a state for the current weather to the data we got in the API
			}.bind(this)
		})
	},
	//the zipsearch takes that data from
	//weather ajax and renders it
	render: function() { //weather component that contains a sidebar, zipsearch, and weather display and need certain properties to get passed through
		return ( //now we have a current weather and zipcode, after hitting the weather ahax
			<div
				id="weather-container"
				class="display"
			>				
				<WeatherSidebar //weather sidebar needs ajax call for weather to render the data it gets back
					weatherData = {this.weatherAJAX} 
					zipCodes = {this.state.locations} //needs zips, refers to a state of the component
					userId = {this.props.userId} //passed down from app
					render = {this.getUsersLocations} //is a function, that gets all the users zipcodes
				 /> 
					<ZipSearch weatherData = {this.weatherAJAX} /> 
					<WeatherDisplay //weatherDataquery's openweather api
						weatherData = {this.weatherAJAX} //query's openweather api
						currentWeather = {this.state.currentWeather} //query's openweather api for current weather
						zipCode = {this.state.zip} //query's openweather api for zip, first time this zip is being made/ passed down
						userId = {this.props.userId} //from above
						render = {this.getUsersLocations} //from above
					 />
			</div>
		);
	}
});

//------------------
//searching zipcode
//------------------

var ZipSearch = React.createClass({ //state of the searchtext is blank because we havent searched for anything yet
	getInitialState: function() {
		return {
			searchText: ''
		}
	},
	//that search text is given a target value
	//to call upon 
	handleLocationChange: function(e) {
		console.log(e.target.value);
		this.setState({
			searchText: e.target.value
		});
	},
	//the search text becomes zip
	handleSearch: function(e) {
		e.preventDefault();
		var zip = this.state.searchText.trim();
		console.log(zip);
		this.props.weatherData(zip);
		console.log("Hi.");
		this.setState({searchText: ""})
	},
	//rendering the zip 
	render: function() {
		return (
			// adding id to form
			<form
				id='zip-search' //makes a request to the ajax call 
				onSubmit={this.handleSearch}> 
				<input //will turn into whatever the user types
					type='text'
					placeholder='Zip Code'
					value={this.state.searchText} //text of user
					onChange={this.handleLocationChange}
					maxlength='5'
					className='zip-input'
				/>
				<button
					type='submit' //goes to the handlesearch //also resets once submit it pressed
					className='zip-input'
				>
					Submit
				</button>
			</form>		
		);
	}
});

//-----------------
// weather sidebar
//-----------------

var WeatherSidebar = React.createClass({
	handleDelete: function(zipcode) {
		// console.log("hallo")
		// console.log(this.props.userId)
		// console.log(zipcode)
		var self = this;
			var callback = function(userId){
			self.props.render(userId);
		};
		$.ajax({
			url: "/users/" + this.props.userId + "/zipcodes/" + zipcode,
			method: "DELETE",
			success: function(data){
				console.log(data)
				callback(data._id)
			}
		})
	},
	lookUp: function(zip){
		this.props.weatherData(zip); //ajax call, which exists in the greater component
	}, 
	render: function() {
		console.log(this.props.zipCodes)
		var self = this; //to preserve the state of the component
		var callback = function(e){
			console.log("i'm working?")
			console.log(e.target.value) // grab the value of whatever you just clicked on
			var zip = e.target.value //the state will change and the page will re-render
			self.lookUp(zip) //refers to this.props.weatherData
		}
		var callback2 = function(e){
			console.log(e.target.value)
			var zipcode = e.target.value
			self.handleDelete(zipcode) //self explanatory, makes a call to useris and zip and deletes the zip
		}//if nothing is there, you dont want to render something that doesnt exist
		var zips = this.props.zipCodes;
		if (zips == null){
			return (
				null
			)
		} else { //if there are, you want to map to them bc [array], and for each zip, they will have an onclick method and a value of themselve
			var locations = zips.map(function(zipcode) {
				return ( //first zipcode refers to zip.map the second zipcode refers to the value pair
					<div 
						className="zipcode"
						onClick = {callback} //display the weather you just clicked on
						value={zipcode.zipcode}>
						{zipcode.zipcode} 
						<button 
							onClick = {callback2} //delete the zip from your database
							value={zipcode._id}
							className='zip-button'
						>
						</button>
					</div>
				);
			});
		};
		return (
			<div
				id='zipcodes'
				className='weather'
			> {locations} </div>
		);
	}
});

//-----------------
// weather display
//-----------------

var WeatherDisplay = React.createClass({ 
	addToDatabase: function(userId){
		console.log("hey there!")
		console.log(this.props.render)
		var self = this; //call back hell is occuring here //also needed to preserve the component
		var callback = function(userId){
			self.props.render(userId); //using a render function to get the users zipcodes again 
		};
		$.ajax({
			url: "/users/" + userId + "/zips", //according to the zipcodes schema/model it has to follow those guidelines
			method: "POST",
			data: {zipcode: this.props.zipCode}, //while adding it to the database
			success: function(data){
				console.log(this); // (this) doesnt refer to the component as a whole
				console.log("it's there. or it should be. idk. hopefully.")
				console.log(data._id)
				callback(data._id); //taking the id, and sending back the user
				// this.props.render(this.props.userId)
			}
		})
	},
	handleClick: function(){
		console.log(this.props.zipCode)
		console.log(this.props.userId)
		// console.log(this.props.render)
		this.addToDatabase(this.props.userId)
	},
	render: function() { //state of weather, so if weather is nothing, return nothing else then render the actual weather data
		console.log(this.props.currentWeather)
		var weather = this.props.currentWeather;
		if (weather == null){
			return (
				null
			)
		} else {
			return (
				<div
					id='weather-display'
					className='weather'
					zip = {weather._id}
				>
					<p id='name'>{weather.name}</p>
					<p id='temp'>{weather.main.temp}</p>
					<p id='desc'>{weather.weather[0].description}</p>
					<p id='high'>hi: {weather.main.temp_max}</p>
					<p id='low'>lo: {weather.main.temp_min}</p>
					<button
						id='add-button'
						onClick = {this.handleClick} //handleclick exists in the component because it exists earlier up in the code 
					>
						Add
					</button>
				</div>
			);
		}
	}
});



//=================
// News
//=================
var News = React.createClass({
	getInitialState: function() {
		return (
			{topics: ['home', 'world', 'national', 'sports', 'business'],
			 home: true,
			 currentTopic: null
			}
		);
	},
	componentDidMount: function(topic) { // adding componentDidMount to load home topic by default
	console.log('Starting.');
		$.ajax({																	
			url: '/users/news/home',		
			method: 'GET',
			success: function(data) {
				console.log(data)
				this.setState({currentTopic: data})
			}.bind(this)
		});
	},
	getArticles: function(topic) {
		console.log('wat')
		$.ajax({																	
			url: '/users/news/' + topic,		
			method: 'GET',
			success: function(data) {
				console.log(data)
				this.setState({currentTopic: data})
			}.bind(this)
		});
	},
	render: function() {
		return (
			// added id
			<div
				id="news-container"
				class="display"
			>
				<NewsSidebar
					topics={this.state.topics}
					getArticles={this.getArticles}
				/>
				<NewsDisplay news={this.state.currentTopic}/>
			</div>
		);
	}
});

//--------------
// news sidebar
//--------------

var NewsSidebar = React.createClass({
	getTopic: function(topic) {
		this.props.getArticles(topic)
	},
	render: function() {
		var self = this;
		console.log(self);
		var callback = function(e) {
			console.log(e.target.value);
			console.log('wat');
			self.getTopic(e.target.value);
		}
		var topics = this.props.topics.map(function(topic) {
			return (
					<div  // changed from <p> to <div>
						onClick={callback}
						value={topic}
						className="topics" // added class
						id={topic} // added id
					>
						{topic}
					</div>
			);
		});
		return (
			<div id="topics-container"> {topics} </div> // added id
		);
	}
});

//--------------
// news display
//--------------

var NewsDisplay = React.createClass({
	render: function() {
		var news = this.props.news;
		if (news == null){
			return (
				null
			)
		} else {
			var articles = this.props.news.map(function(article) {
				return (
					// changed <p> to <br>
					// removed <img>
					// added class
					<div className="article">
						<a href={article.url} target = "_blank">{article.title}</a>
						<br />{article.abstract}
					</div>
				);
			});
		};
		return (
			// added id
			<div id="articles-container"> {articles} </div>
		);
	}
});

//=================
// test ajax calls
//=================

//----------
// ny times
//----------

// $.ajax({																	
// 	url: "/users/news/" + topic,		
// 	method: "GET"
// }).done(function(data){
// 	console.log(data)
// })

//--------------
// open weather
//--------------

// $.ajax({
// 	url: "/users/weather/" + zipcode,
// 	method: "GET"
// }).done(function(data){
// 	console.log(data)
// })

ReactDOM.render(<App />, document.getElementById('main-container'));