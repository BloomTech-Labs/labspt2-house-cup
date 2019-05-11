import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
// import { Route } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
//landingPage imports:
import LandingPage from './sub-components/LandingPage'
//Admin import(s):
import Houses from './sub-components/HousesPage';
//Settings import(s):
import SettingsPage from './sub-components/SettingsPage';
//SignupPage import
import SchoolsPage from './sub-components/SchoolsPage';
//adminAnalyticsPage
import AdminAnalyticsPage from './sub-components/analytics/AdminAnalyticsPage';
//CallbackPage for Auth0.js
import Callback from './Callback.js';
//Secured Route
import SecuredRoute from './sub-components/SecuredRoute';
//Auth0.js
// import NavBar from './sub-components/NavBar';
import BillingPage from './sub-components/BillingPage';
//About.js
import About from './sub-components/About';
import auth from './utils/Auth.js';
//ModifySchool.js
import ModifySchoolPage from './sub-components/ModifySchool';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolData: [],
      name: null,
      email: null,

    }
  }

  componentDidMount = () => {

    const { silentAuth } = auth;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      silentAuth();
    }

    axios.get('http://localhost:5000/schools')
      .then(response => {
        this.setState({ schoolData: response.data.data.schools })
      })
      .catch(err => console.log(err));

  }


  render() {
    return (
      <div className="App">
        <Route exact
          path='/'
          render={(props) =>
            <LandingPage {...props}
              schoolsSelected={this.state.schoolData} />} />
        <Route exact
               path = '/admin/schools'
               render={(props) =>
           <SchoolsPage {...props} 
                        schools={this.state.schoolData} 
                        houseList={this.state.testData}
                        /> 
          }/>
        <Route  exact 
                path = '/admin/schools/:id'
                render={(props) => <Houses {...props} /> }/>
        <Route  exact 
                path = '/admin/schools/:id/update' 
                render={(props) => <ModifySchoolPage {...props} />} />
        {/* <Route exact 
               path = '/admin/settings'
               render={(props) => <SettingsPage {...props} />}   />         */}

        <SecuredRoute path='/about'
          component={About} />
        <SecuredRoute exact
          path='/admin/settings'
          component={SettingsPage} />
        <SecuredRoute exact
          path='/admin/analytics'
          HouseData={this.state.houseData}
          component={AdminAnalyticsPage} />
      </div>
    );
  }

}

export default App;
