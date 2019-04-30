import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
//components
import SideMenu from './SideMenu';
import auth from '../utils/Auth.js';


//testdata; delete later
import schoolsTestData from '../mock data/schools';
import { runInThisContext } from 'vm';

class SchoolsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolsList: [],
            houseList: [],
            newSchool: false,
            newSchoolName: '',
            newSchoolCity: '',
            newSchoolDescription: '',
        }
    }
    componentDidMount() {
        axios.get('http://localhost:5000/schools')
            .then(response => {
                if (response) {
                    console.log(response.data.data.schools)
                    this.setState({ schoolsList: response.data.data.schools })
                    console.log(`Line 30`, this.state.schoolsList);
                } else {
                    console.log(`There is no response from the server`);
                }
            })
            .catch(err => console.log(err))

    }

    addSchool = (e) => {
        e.preventDefault();
        const { getAccessToken } = auth;
        const newSchool = {
            name: this.state.newSchoolName,
            city: this.state.newSchoolCity
        }
        console.log(newSchool);
        if (newSchool) {
            const headers = { Authorization: `Bearer ${getAccessToken()}` };
            axios.post('http://localhost:5000/schools', newSchool, { headers })
                .then(school => {
                    console.log(`Line 50 Schoolspage`, school);
                    let newSchool = school.data.data.newSchool;
                    console.log(`52`, newSchool);
                    this.setState({
                        schoolsList: [...this.state.schoolsList, newSchool]
                    })
                }).catch(err => {
                    console.log(err);
                });
        } else {
            console.log(`Please add newSchool`);
        }
        console.log(`school ${this.state.newSchoolName} added!`);

        this.setState({
            newSchoolName: '',
            newSchoolCity: ''
        });
    }

    handleSchoolInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    newSchoolToggle = e => {
        this.setState({
            newSchool: true
        })
    }

    render() {
        return (
            <div className='schools-page'>
                <SideMenu {...this.props} />
                <div className='schools-container'>
                    <div className='add-school-container'>
                        <h2 className={this.state.newSchool ? 'new-school-toggle' : 'no-new-school'} onClick={this.newSchoolToggle}>Add New School</h2>
                        <div className='add-school-inputs'>
                            <form onSubmit={this.addSchool}>
                                <input className={this.state.newSchool ? 'new-school-toggle' : 'hidden'}
                                    placeholder='name' name='newSchoolName'
                                    value={this.state.newSchoolName}
                                    onChange={this.handleSchoolInput} />
                                <input className={this.state.newSchool ? 'new-school-toggle' : 'hidden'}
                                    placeholder='city'
                                    name='newSchoolCity'
                                    value={this.state.newSchoolCity}
                                    onChange={this.handleSchoolInput}></input>
                                {/* <input className='schoolDescription' placeholder='description' name='newSchoolDescription' onChange={this.handleSchoolInput}></input> */}
                                <button className={this.state.newSchool ? 'new-school-toggle' : 'hidden'}><b>+ Add School +</b></button>
                            </form>
                        </div>
                    </div>
                    <div className='schools-list'>
                        {this.state.schoolsList.map((school) => {
                            return (
                                <div className='school-card'>
                                    <NavLink to={`/admin/schools/${school.id}`} className='menu-button' activeClassName="activeMenu" style={{ textDecoration: "none", color: "inherit" }}>
                                        <h2 className='school-name'>{school.name}</h2>
                                        <h4 className='school-name'>{school.city}</h4>
                                    </NavLink>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default SchoolsPage;