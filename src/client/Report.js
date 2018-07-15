import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import TabItem from "./TabItem";
import Content from "./Content";
export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = { timestamps: null, selectedTimestamp: null };
    this.updateTimestamp = this.updateTimestamp.bind(this);
  }


  componentDidMount() {
    fetch("/api/getTimestamps")
      .then(res => res.json())
      .then(timestamps => {
        console.log("timestamps", timestamps);
        var i = 0;
        var listItems = timestamps.map(time => {
          i++;
          return (<TabItem time={time} active={i == 1 ? "active" : ""} key={time} updateTimestamp={this.updateTimestamp}></TabItem>);
        });
        this.setState({timestamps: listItems});
      });
  }

  updateTimestamp(timestamp) {
    console.log('update time', timestamp);
    this.setState({selectedTimestamp: timestamp});
  }

  render() {
    return (
      <div className="row">
        <div className="col-2">
          <ul className="nav flex-column">
            {this.state.timestamps}
          </ul>
        </div>
        <div className="col-10">
          <Content timestamp={this.state.selectedTimestamp}/>
        </div>
      </div>
    );
  }
}
