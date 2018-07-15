import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


import Filter from './Components/Filter';
import Table from './Components/Table';
import PieChart from './Components/PieChart';
import LineChart from './Components/LineChart';
import emitter from "./ev"
import { constants } from "./Constants"

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.updateChart = this.updateChart.bind(this);
        this.state = {
            // jobConfig: {},
            data: null
        };
        // var keys = Object.keys(constants.event);
        // keys.forEach(key => this.state.jobConfig[key] = null);
        
    }
    
    updateChart(jobConfig) {
        console.log('jobcon', jobConfig);
        if (this.props.timestamp == null) return;
        for (var key in jobConfig) {
            if (jobConfig[key] == null) {
                return;
            }
        }
        var query = '';
        Object.keys(jobConfig).forEach(key => query += `&${key}=${jobConfig[key]}`);
        fetch(`/api/getChartData?timestamp=${this.props.timestamp}${query}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
    }

    componentDidMount() {
        this.eventEmitters = {};
        var keys = Object.keys(constants.event);

        keys.forEach(key => {
            this.eventEmitters[key] = emitter.addListener(constants.event[key], (selected) => {
                this.setState((prevState, props) => {
                    prevState.jobConfig[key] = selected;
                    return (prevState);
                }, () => this.updateChart());
            });
        });
    }

    componentWillUnmount() {
        Object.key(this.eventEmitters).forEach(eventEmitter => emitter.removeListener(eventEmitter));
    }
    
    render() {
        return (
            <div>
                <div className="row">
                    <Filter timestamp={this.props.timestamp} updateChart={this.updateChart}/>
                </div>
                <div className="row">
                    <Table />  
                </div>
                <div className="row">
                    <PieChart title="Latency Distribution In Total" id={constants.pieChartId.message} />  
                </div>
                <div className="row">
                    <LineChart title="Latency Distribution In Time"/>
                </div>
            </div>
        );
    }
}
