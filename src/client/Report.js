import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import TabItem from "./TabItem";
import Content from "./Content";
import Sticky from "react-sticky-el";

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
        var i = -1;
        var listItems = timestamps.map(time => {
          i++;
          var item = (<TabItem time={time} active={i == 1 ? "active" : ""} key={time} updateTimestamp={this.updateTimestamp}></TabItem>);
          if (i == 0) this.setState({ selectedTimestamp: time });
          return item;
        });
        listItems = listItems.reverse();
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
        <div className="col-1">
          <Sticky>
            <ul className="nav flex-column nav-pills">
              {this.state.timestamps}
            </ul>
          </Sticky>
        </div>

        
        <div className="col-11 ">
            <Content timestamp={this.state.selectedTimestamp}/>
        </div>
      </div>
    );
  }
}
