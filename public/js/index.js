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
		console.log(this.state)
		this.setState({
			authenticatedUser: '',
		});
	},

	//setting auth user to true to 
	//keep them logged in and dataId for additional functionality.
	changeLogin: function(dataId) {
		this.setState({
			userId: dataId,
			authenticatedUser: true
		});
	},
	//renders the login form and the signup button if authenticated user is false.
	//if authenticated user is true, it'll render the user's homepage component.
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		// console.log('cookie:', document.cookie);
		if(this.state.authenticatedUser === true) {
			return (
				<Page userId = {this.state.userId} onChange={this.eatTheCookie} />		//userId getting passed through for user-specific data and this.eatTheCookie to logout. both things a user needs on their homepage.							
			)																																			
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
						initialLoginCheck={this.state.authenticatedUser}
						onChange={this.changeLogin}
					/>
					<SignUpButton onChange={this.changeLogin}/>
				</div>
			);
		}
	}
});

	//passing the above attributes down bc we want to be able to access the state of the authenticated user
	//and later change it upon logging in.

// ======================
// login form component
// ======================

//unique stylistic approach of appropriate states in the relevant components. COULD have put login form state
//in the overall application, but it's not really relevant there? idk, just a way of thinking.

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
		var change = {};																//creating this empty object bc email and password will become key/value pairs
		change[stateName] = e.target.value;							//change[stateName] allows for both email and password fields to be changed simultaneously.
		this.setState(change);
	},
	handleSubmit: function(e) {
		//the user credentials are then saved 
		e.preventDefault();														//prevents default action of the form (which is a post request to a specified route. not what we're looking for here)
		var username = this.state.username.trim();		//set username and password to the states that were set in line 95 and .trim() will take off the whitespace on the end.
		var password = this.state.password.trim();
		this.loginAJAX(username, password);						//calls on this ajax request method which takes in the username and the password declared above.
	},
	loginAJAX: function(username, password) {
		//ajax request to save the user creds 
		$.ajax({
			url: '/auth',																	//post request to /auth
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
				this.props.onChange(data.id) //this.props.onChange is referring to the login functionality that was passed down when the page was rendered. 
			}.bind(this),										//sets authenticatedUser state to true and userId state equal to data.id
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	//rendering the login form
	render: function() {
		return (
			<div className='login-form'>
				<h3>Forking Login</h3>
				<form onSubmit={this.handleSubmit}>
					<input
						className='username-login-form'
						type='text' 
						placeholder='username'
						value={this.state.username}
						onChange={this.handleLoginFormChange.bind(this, 'username')}
					/>
					<br/>
					<input
						className='password-login-form'
						type='password'
						placeholder='password'
						value={this.state.password}
						onChange={this.handleLoginFormChange.bind(this, 'password')}
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

//logging out 
var Page = React.createClass({
	render: function() {
		console.log(this.props.userId)
		return (																	//this.props.onChange is referring to "this.eatTheCookie" which was passed down. and the weather component is getting the userId
			<div main-container>
				<LogOut onChange={this.props.onChange} />			
				<Weather userId = {this.props.userId} />
				<News />
			</div>
		);
	}
});

var LogOut = React.createClass({
	handleClick: function() {
		console.log('WAT')
		console.log(this.props.onChange);
		this.props.onChange();								//when the logout button is clicked, it'll invoke the "eat the cookie" function that exists in the app component
	},																			//this will reset the state of the authenticated user and cause the page to rerender.
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
		return (								//all of these are things are starting off as null because nothing has happened!!!
			{
				locations: null,
				currentWeather: null,
				zip: null
			}	
		)
	},
	//componentDidMount will run the function for the 
	//Ajax call to render the zipcodes upon loading.
	//runs whatever functionality that's inside of it 
	//ONE TIME after initial render. that way, don't
	//get caught in an infinite loop.
	componentDidMount: function(){
		this.getUsersLocations(this.props.userId)
	},
	getUsersLocations: function(userId){								//this grabs the user's zipcodes out of the database
		console.log(userId)		
		$.ajax({
			url: "/users/" + userId,
			method: "GET",
			success: function(data) {
				console.log(data)
				this.setState({locations: data})							//upon success, sets the state of the locations equal to the data returned.
			}.bind(this)
		})
	},
	weatherAJAX: function(zipcode) {
		$.ajax({
			url: "/users/weather/" + zipcode,
			method: "GET",
			success: function(data) {
				console.log(data)
				console.log(zipcode)
				this.setState({currentWeather: data, zip: zipcode}) 		//success from ajax call will set currentWeather state to the data and the zip state to the zipcode that was searched
			}.bind(this)
		})
	},
	//the zipsearch takes that data from
	//weather ajax and renders it
	render: function() {
		return (												//the three components that make up the weather component need certain properties to function, which are passed down from this component
			<div
				id="weather-container"
				class="display"
			>				
				<WeatherSidebar 
					weatherData = {this.weatherAJAX} 				// needs to make call to API when clicked
					zipCodes = {this.state.locations}				
					userId = {this.props.userId}						//userId is passed down from App
					render = {this.getUsersLocations}				//function that gets all the user's zipcodes
				 />
					<ZipSearch weatherData = {this.weatherAJAX} />
					<WeatherDisplay
						weatherData = {this.weatherAJAX} 
						currentWeather = {this.state.currentWeather} 
						zipCode = {this.state.zip} 
						userId = {this.props.userId}
						render = {this.getUsersLocations}
					 />
			</div>
		);
	}
});

//------------------
//searching zipcode
//------------------

var ZipSearch = React.createClass({
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
				id='zip-search'
				onSubmit={this.handleSearch}>
				<input
					type='text'
					placeholder='Zip Code'
					value={this.state.searchText}
					onChange={this.handleLocationChange}
					maxlength='5'
					className='zip-input'
				/>
				<button
					type='submit'
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
			self.props.render(userId);														//going to look up the zipcodes again from the database. now that there's one less, the state will change and the page will rerender.
		};
		$.ajax({
			url: "/users/" + this.props.userId + "/zipcodes/" + zipcode,
			method: "DELETE",
			success: function(data){
				console.log(data)
				callback(data._id)																//SO MUCH CALLBACK HELL. so little time.
			}
		})
	},
	lookUp: function(zip){
		this.props.weatherData(zip);
	},
	render: function() {
		console.log(this.props.zipCodes)
		var self = this;
		var callback = function(e){
			console.log("i'm working?")
			console.log(e.target.value)					//get the value of the one we clicked on
			var zip = e.target.value
			self.lookUp(zip)										//going to lead to the ajax call to openweather. eventually.
		}
		var callback2 = function(e){
			console.log(e.target.value)
			var zipcode = e.target.value
			self.handleDelete(zipcode)
		}
		var zips = this.props.zipCodes;
		if (zips == null){									//same as the weather, can't try to render what doesn't exist
			return (
				null
			)
		} else {
			var locations = zips.map(function(zipcode) {
				return (									//callback will display the weather for selected zip. callback2 deletes the zipcode from the db
					<div 
						className="zipcode"
						onClick = {callback}
						value={zipcode.zipcode}>
						{zipcode.zipcode} 
						<button 
							onClick = {callback2}
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
		var self = this 																			//setting self equal to this to preserve the component
		var callback = function(userId){											//callback hell is occurring here. yikes.
		self.props.render(userId);														//now that we're free of the ajax call, can use the render function to get the user's zipcodes from the database again.
		};
		$.ajax({
			url: "/users/" + userId + "/zips",
			method: "POST",
			data: {zipcode: this.props.zipCode},								//have to follow the zipcode schema while adding to the database
			success: function(data){
				console.log(this);																//"this" was not referring to the component as a whole, but rather the ajax call. hence the need for a callback
				console.log("it's there. or it should be. idk. hopefully.")
				console.log(data._id)
				callback(data._id);
				// this.props.render(this.props.userId)
			}
		})
	},
	handleClick: function(){
		console.log(this.props.zipCode)
		console.log(this.props.userId)
		// console.log(this.props.render)
		this.addToDatabase(this.props.userId)								//when the add button is clicked, it will call on an addToDataBase function that exists within this component
	},
	render: function() {
		console.log(this.props.currentWeather)
		var weather = this.props.currentWeather;
		if (weather == null){																//if there is no current weather, then don't try to render anything
			return (
				null
			)
		} else {
			return (																			//now that there IS weather data, this will extract all the relevant data into a div
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
						onClick = {this.handleClick}
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
var News = React.createClass({							//larger news component that has an array of topics and displays whatever the current topic is.
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
	getArticles: function(topic) {							//when a topic is clicked on, an ajax call is sent to the NYT API and the data is parsed in the controller and then returned
		console.log('wat')
		$.ajax({																	
			url: '/users/news/' + topic,		
			method: 'GET',
			success: function(data) {
				console.log(data)
				this.setState({currentTopic: data})			//when the state of the current topic is set, it rerenders
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

var NewsSidebar = React.createClass({															//maps through the "topics" array that was set in the news component and renders them
	getTopic: function(topic) {																			//with a click function that queries the API
		this.props.getArticles(topic)
	},
	render: function() {
		var self = this;
		console.log(self);
		var callback = function(e) {																	//needed a callback to actually reach the API request

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
		if (news == null){																//if there is no current topic, then return null (but with componentDidMount, it'll just show the home topic automatically)
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