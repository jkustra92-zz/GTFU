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
		Cookies.remove('temp');  
		console.log(this.state)
		this.setState({
			authenticatedUser: '',
		});
	},

	//setting auth user to true to 
	//keep them logged in
	changeLogin: function(dataId) {
		this.setState({
			userId: dataId,
			authenticatedUser: true
		});
	},
	//renders the login form and the signup button
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		// console.log('cookie:', document.cookie);
		if(this.state.authenticatedUser === true) {
			return (
				<Page userId = {this.state.userId} onChange={this.eatTheCookie} />									
			)																																			
		}else{
			return (
				<div id = 'homepage'>
					<LoginForm
						initialLoginCheck={this.state.authenticatedUser}
						onChange={this.changeLogin}
					/>
					<SignUpForm onChange={this.changeLogin}/>
				</div>
			);
		}
	}
});

// ======================
// login form component
// ======================

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
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		//the user credentials are then saved 
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password) {
		//ajax request to save the user creds 
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
				this.props.onChange(data.id)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	//rendering the login form
	render: function() {
		return (
			<div className='login-form'>
				<h3>Please Login</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor='username'>Username</label>
					<input
						className='username-login-form'
						type='text' 
						value={this.state.username}
						onChange={this.handleLoginFormChange.bind(this, 'username')}
					/>
					<br/>
					<label htmlFor='password'>Password</label>
					<input
						className='password-login-form'
						type='password'
						value={this.state.password}
						onChange={this.handleLoginFormChange.bind(this, 'password')}
					/>
					<br/>
					<input type='submit' />
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
			return(<button onClick = {this.handleClick}>sign up!</button>)
		}else{
			return(
				<SignUpButton onChange={this.props.changeLogin}/>)
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
				<h3>Sign Up</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor='username'>Username</label>
					<input
						className='username-signup-form'
						type='text'
						value={this.state.username}
						onChange={this.handleSignupFormChange.bind(this, 'username')}
					/>
					<label htmlFor='email'>E-Mail</label>
					<input
						className='email-signup-form'
						type='text'
						value={this.state.email}
						onChange={this.handleSignupFormChange.bind(this, 'email')}
					/>
					<label htmlFor='password'>Password</label>
					<input
						className='password-signup-form'
						type='text'
						value={this.state.password}
						onChange={this.handleSignupFormChange.bind(this, 'password')}
					/>
					<input type='submit' />
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
		return (
			<div>
				<LogOut onChange={this.props.onChange} />
				<News />
				<Weather userId = {this.props.userId}/>
			</div>
		);
	}
});

var LogOut = React.createClass({
	handleClick: function() {
		console.log('WAT')
		console.log(this.props.onChange);
		this.props.onChange();
	},
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
		return (
			{
				locations: null,
				currentWeather: null,
				zip: null
			}	
		)
	},
	//componentDidMount will run the function for the 
	//Ajax call to render the zipcodes upon loading.
	componentDidMount: function(){
		this.getUsersLocations(this.props.userId)
	},
	getUsersLocations: function(userId){
		console.log(userId)
		$.ajax({
			url: "/users/" + userId,
			method: "GET",
			success: function(data) {
				console.log(data)
				this.setState({locations: data})
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
				this.setState({currentWeather: data, zip: zipcode})
			}.bind(this)
		})
	},
	//the zipsearch takes that data from
	//weather ajax and renders it
	render: function() {
		return (
			<div>
				<ZipSearch weatherData = {this.weatherAJAX} />
				<WeatherSidebar 
					weatherData = {this.weatherAJAX} 
					zipCodes = {this.state.locations} 
					userId = {this.props.userId}
					render = {this.getUsersLocations}
				/>
				<WeatherDisplay 
					currentWeather = {this.state.currentWeather} 
					zipCode = {this.state.zip} 
					userId = {this.props.userId}
					render = {this.getUsersLocations}/>
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
			<form onSubmit={this.handleSearch}>
				<input
					type='text'
					placeholder='Zip Code'
					value={this.state.searchText}
					onChange={this.handleLocationChange}
					maxlength="5"
				/>
				<button type='submit'>Submit</button>
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
		this.props.weatherData(zip);
	},
	render: function() {
		console.log(this.props.zipCodes)
		var self = this;
		var callback = function(e){
			console.log("i'm working?")
			console.log(e.target.value)
			var zip = e.target.value
			self.lookUp(zip)
		}
		var callback2 = function(e){
			console.log(e.target.value)
			var zipcode = e.target.value
			self.handleDelete(zipcode)
		}
		var zips = this.props.zipCodes;
		if (zips == null){
			return (
				null
			)
		} else {
			var locations = zips.map(function(zipcode) {
				return (
					<div>
						<p 
							onClick = {callback}
							value={zipcode.zipcode}>
							{zipcode.zipcode}
						</p>
						<button 
							onClick = {callback2}
							value={zipcode._id}
						>delete</button>
					</div>
				);
			});
		};
		return (
			<div> {locations} </div>
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
		var self = this;
		var callback = function(userId){
			self.props.render(userId);
		};
		$.ajax({
			url: "/users/" + userId + "/zips",
			method: "POST",
			data: {zipcode: this.props.zipCode},
			success: function(data){
				console.log(this);
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
		this.addToDatabase(this.props.userId)
	},
	render: function() {
		console.log(this.props.currentWeather)
		var weather = this.props.currentWeather;
		if (weather == null){
			return (
				null
			)
		} else {
				return (
					<div zip = {weather._id}>
						<p>{weather.name}</p>
						<p>{weather.main.temp}</p>
						<p>{weather.weather[0].description}</p>
						<p>{weather.main.temp_max}</p>
						<p>{weather.main.temp_min}</p>
						<button onClick = {this.handleClick}>add</button>
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
			<div id="news-container">
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
						<a href={article.url}>{article.title}</a>
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