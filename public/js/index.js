// ========================
// the entire application
// ========================

var App = React.createClass({
	getInitialState: function() {
		var cookieCheck;
		if(document.cookie) {
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			authenticatedUser: cookieCheck
		};
	},
	eatTheCookie: function() { 												// thanks Joe
		Cookies.remove('jwt_token');
		console.log(this.state)
		this.setState({
			authenticatedUser: '',
		});
	},
	changeLogin: function() {
		this.setState({
			authenticatedUser: true
		});
	},
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		// console.log('cookie:', document.cookie);
		if(this.state.authenticatedUser === true) {
			return (
				<TestSuccess onChange={this.eatTheCookie} />									
			)																																			
		}else{
			return (
				<div id = "homepage">
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
	getInitialState: function() {
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck
		};
	},
	handleLoginFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password) {
		$.ajax({
			url: '/auth',
			method: 'POST',
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log('Token acquired.');
				console.log(data);
				Cookies.set('jwt_token', data.token);
				this.props.onChange(data.token)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
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
						type='text'
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

// var TestSuccess = React.createClass({							
// 	handleClick: function(){
// 		console.log('WAT')
// 		this.props.onChange()
// 	},
// 	render: function(){
// 		return (
// 			<div>
// 				<button
// 					onClick={this.handleClick}
// 					id='logout-button'
// 					>
// 					Log Out
// 				</button>
// 				<h1>hello!</h1>
// 			</div>
// 		);
// 	}
// });

//=======================																	
// signup link component
//=======================

// var SignUpLink = React.createClass({
// 	getInitialState: function(){
// 	return ({clicked: false})
// 	},
// 	handleClick: function(){
// 		this.setState({clicked: true})
// 	},
// 	render: function() {
// 		if (this.state.clicked == false){
// 			return(<a href='#' onClick = {this.handleClick}>sign up!</a>)
// 		}else{
// 			return(
// 				<SignUpForm/>)
// 		}
// 	}
// });

//========================
// sign up form component
//========================

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
	handleSubmit: function(e) {
		e.preventDefault();
		console.log('WAT THE HELL');
		var username = this.state.username.trim();
		var email = this.state.email.trim();
		var password = this.state.password.trim();
		this.signupAJAX(username, email, password);
	},
	signupAJAX: function(username, email, password) {
		var self = this;
		var callback = function() {
			self.props.onChange();
		}

		$.ajax({
			url: '/users',
			method: 'POST',
			data: {
				username: username,
				email: email,
				password: password
			}
		}).done(function(data) {
			console.log(data);
			Cookies.set('temp', 'asdfghjkl;');
			callback();
		});
	},
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
					<input type='submit'/>
				</form>
			</div>
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

ReactDOM.render(<App/>, document.getElementById('main-container'));