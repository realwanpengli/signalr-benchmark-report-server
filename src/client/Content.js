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
import { messagePieConfigGenerator } from "./Components/Chart/MessagPieChartConfig";
import { messageLineConfigGenerator } from "./Components/Chart/MessageLineChartConfigGenerator";
import { messageRateLineConfigGenerator } from "./Components/Chart/MessageRateLineChartConfigGenerator";

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.updateChart = this.updateChart.bind(this);
        this.state = {
            chartConfig: {
                messagePie: {},
                connectionPie: {},
                messageLine: {},
                messageRateLine: {}
            }
        };
    }
    
    updateChart(jobConfig) {
        console.log('jobcon', jobConfig, 'timestamp', this.props.timestamp);
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
            var messagePieChartConfig = messagePieConfigGenerator(data);
            var messageLineChartConfig = messageLineConfigGenerator(data);
            var messageRateLineChartConfig = messageRateLineConfigGenerator(data);
            this.setState((prevState, props) => {
                prevState.chartConfig.messagePie = messagePieChartConfig;
                prevState.chartConfig.messageLine = messageLineChartConfig;
                prevState.chartConfig.messageRateLine = messageRateLineChartConfig;
                return prevState;
            });
        });
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
                    <PieChart title="Latency Distribution In Total" id={constants.pieChartId.messagePie} config={this.state.chartConfig.messagePie} />  
                </div>
                <div className="row">
                    <PieChart title="Latency Distribution In Time" id={constants.lineChartId.messageLine} config={this.state.chartConfig.messageLine}/>
                </div>
                <div className="row">
                    <PieChart title="Latency Rate Distribution In Time" id={constants.lineChartId.messageRateLine} config={this.state.chartConfig.messageRateLine} />
                </div>
            </div>
        );
    }
}
