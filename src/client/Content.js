import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sticky from 'react-sticky-el';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


import Filter from './Components/Filter';
import Table from './Components/Table';
import PieChart from './Components/PieChart';
import LineChart from './Components/LineChart';
import Summary from './Components/Summary'

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
            },
            dataAvailable: ""
        };
    }
    
    componentDidMount() {
        
    }

    updateChart(jobConfig) {
        if (this.props.timestamp == null) {
            // destoy all charts
            this.setState((prevState, props) => {
                prevState.chartConfig.messagePie = null;
                prevState.chartConfig.messageLine = null;
                prevState.chartConfig.messageRateLine = null;
                return prevState;
            });
        }
        for (var key in jobConfig) {
            if (jobConfig[key] == null) {
                return;
            }
        }

        var el = document.getElementById('charts');
        if (el) el.style = "display: block";

        var query = '';
        Object.keys(jobConfig).forEach(key => query += `&${key}=${jobConfig[key]}`);
        fetch(`/api/getChartData?timestamp=${this.props.timestamp}${query}`)
        .then(res => res.json())
        .then(data => {
            console.log('chart data', data);
            if (data == null || data.length == 0) {
                this.setState({dataAvailable: "Data not exists"});
                var el = document.getElementById('charts');
                console.log('555555', el);
                if (el) el.style = "display: none";
                return;
            }
            var messagePieChartConfig = messagePieConfigGenerator(data);
            var messageLineChartConfig = messageLineConfigGenerator(data);
            var messageRateLineChartConfig = messageRateLineConfigGenerator(data);
            this.setState((prevState, props) => {
                console.log('cccccccc');
                prevState.dataAvailable = ``;
                prevState.chartConfig.messagePie = messagePieChartConfig;
                prevState.chartConfig.messageLine = messageLineChartConfig;
                prevState.chartConfig.messageRateLine = messageRateLineChartConfig;
                return prevState;
            });
        });
    }

    

    

    render() {
        return (
            <div >
                <Summary timestamp={this.props.timestamp}/>
                <div className="row">
                    <div className="col-4">
                        <Sticky>
                            <div className="row">
                                <Filter timestamp={this.props.timestamp} updateChart={this.updateChart} />
                                <h3 style={{color: 'red', backgroundColor: 'black'}}>{this.state.dataAvailable}</h3>
                            </div>
                        </Sticky>
                    </div>
                    <div  className="col-8">
                        <div id='charts'>
                            <div className="row">
                                <PieChart title="Latency Distribution In Total" description="" id={constants.pieChartId.messagePie} config={this.state.chartConfig.messagePie} />
                            </div>
                            <div className="row">
                                <PieChart title="Latency Distribution In Time" description="" id={constants.lineChartId.messageLine} config={this.state.chartConfig.messageLine} />
                            </div>
                            <div className="row">
                                <PieChart title="Sending/Receiving rate" description="Message count for sending and receiving per second" id={constants.lineChartId.messageRateLine} config={this.state.chartConfig.messageRateLine} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
