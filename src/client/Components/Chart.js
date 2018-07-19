import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import {constants} from "../Constants"
import 'chart.js'

export default class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: null
        }
        console.log('pie', this.props.id);
        
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProv) {
        

        if (nextProv.config == null || 
            nextProv.config.data == null || 
            nextProv.config.options == null || 
            nextProv.config.type == null) 
            return;

        var ctx = document.getElementById(this.props.id).getContext('2d');
        this.setState((prevState, props) =>{
            if (prevState.chart) prevState.chart.destroy();
            // if (prevState.chart != null) {
            //     delete prevState.chart;
            // }
            prevState.chart = new Chart(ctx, nextProv.config);
            return prevState;
        });
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h5>{this.props.title}</h5>
                    </div>
                    <canvas id={this.props.id}>
                    </canvas>
                </div>
            </div>
        );
    }
} 