//The Almighty Application

var App = React.createClass({
	getInitialState: function() {
		var cookieCheck;
		if(document.cookie) {
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			justLoggedOut: false,
			authenticatedUser: cookieCheck
		};
	},
	logOut: function(){
		console.log(this.state)
		this.setState({
			authenticatedUser: "",
			justLoggedOut: true
		})
	},
	changeLogin: function(username) {
		console.log(username)
		this.setState({
			username: username,
			authenticatedUser: true
		})
		Cookies.remove();
	},
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		console.log('cookie:', document.cookie);

		if(this.state.authenticatedUser === true) {
			console.log(this.state.username.username)
			return (
				<TestSuccess userName = {this.state.username.username} onChange={this.logOut}/>
			)
		}else if (this.state.justLoggedOut) {
			console.log("ur mother")
			return(
				<div>
					<GoodBye userName = {this.state.username.username}/>
				</div>
			)
		}else{
			return (
				<div>
					<LoginForm initialLoginCheck={this.state.authenticatedUser} onChange={this.changeLogin}/>
				</div>
			)
		}
	}
});


// LoginFormComponent
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
			method: "POST",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log("token acquired");
				Cookies.set('jwt_token', data.token);
				console.log(data);
				console.log(data.username)
				this.props.onChange(data)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},

	render: function() {
		// console.log(this);
		return (
			<div className="login-form" >
				<h3>Please Login</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="username">Username</label>
					<input className="username-login-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
					<br/>
					<label htmlFor="password">Password</label>
					<input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
					<br/>
					<input type="submit"/>
				</form>
			</div>
		)
	}
})

var TestSuccess = React.createClass({
	handleClick: function(){
		console.log("wat")
		this.props.onChange()
	},
	render: function(){
		return(
		<div>
			<button onClick = {this.handleClick} id = "logout-button">log out</button>
			<h1>hello, {this.props.userName}!</h1>
		</div>)
	}
})

var GoodBye = React.createClass({
	render: function(){
		return (<h1>goodbye, {this.props.userName}!</h1>)
	}
})

// var SignUpLink = React.createClass({
// 	getInitialState: function(){
// 	return ({clicked: false})
// 	},
// 	handleClick: function(){
// 		this.setState({clicked: true})
// 	},
// 	render: function() {
// 		if (this.state.clicked == false){
// 			return(<a href="#" onClick = {this.handleClick}>sign up!</a>)
// 		}else{
// 			return(
// 				<SignUpForm/>)
// 		}
// 	}
// })

// var SignUpForm = React.createClass({
// 	getInitialState: function(){
// 		return(
// 			{username: "", email: "", password: ""}
// 		)
// 	},
// 	handleSubmit: function(e){
// 		e.preventDefault();
// 		console.log("halp");
// 	},
// 	render: function(){
// 	return (			
// 		<div className="signup-form" >
// 				<h3>Sign Up Here!</h3>
// 				<form onSubmit={this.handleSubmit}>
// 					<label htmlFor="username">Username</label>
// 					<input className="username-signup-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange}/>
// 					<br/>
// 					<label htmlFor="password">Email</label>
// 					<input className="username-signup-form" type="text" value={this.state.email} onChange={this.handleLoginFormChange}/>
// 					<br/>
// 					<label htmlFor="password">Password</label>
// 					<input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange}/>
// 					<br/>
// 					<input type="submit"/>
// 				</form>
// 			</div>)
// 	}
// })

ReactDOM.render(<App/>, document.getElementById('main-container'));