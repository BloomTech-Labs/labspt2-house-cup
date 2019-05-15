import React, { Component } from 'react';
import Chart from "react-google-charts";
import Graph from '../Styles/Graphs.js';
import SideMenu from '../SideMenu.js';
import Select from 'react-select';
import auth from '../../utils/Auth.js';
import dummyData from './dummy.js';
import axios from 'axios';

export default class AdminAnalyticsPage extends Component {
  constructor(props) {
    super(props);
     this.state = {
        graphData: dummyData,
        selectedOption: null,
        data: null,
        year: '2019'    
                    
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
  const length = this.state.graphData.years.length;
  const year = this.state.graphData.years[length-1]
  this.setState({
     selectedOption: this.state.graphData.years[length-1],
     data: this.state.graphData.data[year.label]
  })
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
      const length = this.state.graphData.years.length;
    return (
      <div className="analytics">
        <SideMenu />
        <div className="graphs">
           <form className="select" onSubmit={this.handleSubmit}>
                <Select value={selectedOption}
                        name= "selectedOption"
                        defaultValue={this.state.graphData.years[length-1]}
                        onChange={(value) => this.handleChange(value)}
                        options={this.state.graphData.years} />     
            </form>
           
          <Graph>
            <Chart 
                chartType="LineChart"
                data={this.state.data}
                options={this.state.graphData.options}
                loader={<div className='loading'>...Loading Chart</div>}
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


