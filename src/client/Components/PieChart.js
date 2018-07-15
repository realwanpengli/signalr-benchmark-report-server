import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import {constants} from "../Constants"
import 'chart.js'

export default class ClassName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: null
        }

        // var ctx = document.getElementById(this.props.chartId).getContext('2d');
        // this.state.chart = new Chart(ctx, this.state.pieConfig);
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        Object.key(this.eventEmitters).forEach(eventEmitter => emitter.removeListener(eventEmitter));
    }
    
    render() {


        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h2>{this.props.title}</h2>
                    </div>
                    <canvas id={this.props.chartId}>
                    </canvas>
                </div>
            </div>
        );
    }
} 