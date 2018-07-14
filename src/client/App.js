import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import Report from './Report';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: null };
  }

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1>SignalR Benchmark Report</h1>
          </div>
        </div>
        <Report />
        
        
      </div>
      
    );
  }
}
