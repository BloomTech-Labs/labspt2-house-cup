import React, { Component } from 'react';
import SideMenu from './SideMenu';

class SettingsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			newPassword: '',

		};
	}
	render() {
		return (
			<div>
				<SideMenu {...this.props} />
				<div className="settings">
					<div className="Modal">
						<form 
						onSubmit={this.handleSubmit}
						>
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
								type="newPassword"
								className="Input"
								placeholder="New Password"
								value={this.state.newPassword}
								onChange={this.handleInput} required />
							<button type="submit" value="Save">Save</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default SettingsPage;