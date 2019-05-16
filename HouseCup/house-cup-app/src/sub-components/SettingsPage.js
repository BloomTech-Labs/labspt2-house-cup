import React, { Component } from 'react';
import SideMenu from './SideMenu';
import auth from '../utils/Auth';
import axios from 'axios';

class Settings extends Component {
					constructor(props) {
					super(props);
					this.state ={
							email:'',
							password: '',
							newPassword:'',
					};
		}

componentDidMount() {

}

updateUser = (newPassword) => {
		const { getAccessToken } = auth;
		console.log(`New password`, newPassword);
		const headers = { Authorization: `Bearer ${getAccessToken()}` };
		axios.patch('http://localhost:5000/users/update', newPassword, {headers})
				.then( res=> {
							console.log(`settings line 24`, res);
				})
				.catch(err => {
					  	console.log(`Line 29 settingspage error`,err);
				});  
};

handleInput = (event) => {
this.setState({
		[event.target.name]: event.target.value
    })
}

handleSubmit = (event) => {
			event.preventDefault();
			const updatedUser =  {password: this.state.newPassword}
			this.updateUser(updatedUser)
			this.setState({
					email: '',
					password: '',
					newPassword: ''
			});
  }
render() {
return (
<>
<div className="settings">
<SideMenu />
<div className="Modal">
<form onSubmit={this.handleSubmit}>
	<h1>Update Password</h1>
            <input name="email"
						       type="email"
									 className="Input" 
									 placeholder="Your email"
									 value={this.state.email}
									 onChange={this.handleInput} required />
            <input name="password"
						       type="password" 
									 className="Input" 
									 placeholder="Old Password"
									 value={this.state.password}
									 onChange={this.handleInput} required />
            <input name="newPassword"
						       type="password" 
									 className="Input" 
									 placeholder="New Password"
									 value={this.state.newPassword}
									 onChange={this.handleInput} required  />		
					  <button type="submit" value="Save">Save</button>			 							 									 
</form>

					</div>
				</div>
			</>
		);
 }
}

export default Settings;