import React, { Component } from 'react';
import Chart from "react-google-charts";
import Graph from '../Styles/Graphs.js';
import SideMenu from '../SideMenu.js';
import Select from 'react-select';
import auth from '../../utils/Auth.js';
import dummyData from './dummy.js';
import axios from 'axios';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

export default class AdminAnalyticsPage extends Component {
  constructor(props) {
    super(props);
     this.state = {
        graphData: dummyData,
        selectedOption: null,
        data: null     
                    
      }
  }

handleChange = (selectedOption) => {
    const year = selectedOption["label"]
    const yearData = this.state.graphData.data[year]
    this.setState({ 
        selectedOption: selectedOption,
        data: yearData
       });
    console.log(`Option selected:`, selectedOption["label"]);
}

renderGraphs = () => {
    this.setState({
      options: this.state.options,
      data: [...this.state.data]
    })
}

componentDidMount() {
  window.addEventListener('resize', this.renderGraphs);
  const {getAccessToken} = auth;
  const headers = {Authorization : `Bearer ${getAccessToken()}`}
   axios.get('http://localhost:5000/schools/houses/data', {headers})
        .then( response => {
          console.log(response.data);
        })
        .catch(err => {
           console.log(`Error message from analytics page`, err);
        });
}  

 
 componentUpdate() {
   window.addEventListener('resize', this.renderGraphs);
 }
  render() {
      const { selectedOption } = this.state;
    return (
      <div className="analytics">
        <SideMenu />
        <div className="graphs">
           <form className="select" onSubmit={this.handleSubmit}>
                <Select value={selectedOption}
                        defaultValue={{ label: "2019", value: "2019" }}
                        onChange={this.handleChange}
                        options={this.state.graphData.years} />     
            </form>
           
          <Graph>
            <Chart 
                chartType="LineChart"
                data={this.state.data}
                options={this.state.graphData.options}
                loader={<div>Loading Chart</div>}
                className="chart"
                max-width={"100%"}
                height={"480px"}
            />
          </Graph>             
        </div>     
      </div>
    )
  }
}


